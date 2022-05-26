#include <linux/kernel.h>
#include <linux/module.h>
#include <linux/mod_devicetable.h>
#include <linux/i2c.h>
#include <linux/device.h>
#include <linux/mutex.h>
#include <linux/time.h>
#include <linux/delay.h>

#include <linux/iio/iio.h>
#include <linux/iio/sysfs.h>

#include "ccs811.h"

struct ccs811_data
{
	struct i2c_client *client;
	struct mutex lock;
	
	__be16 eCO2;
	__be16 TVOC;
	uint8_t error_id;
	uint16_t raw_data;
	uint8_t status;
};

const unsigned long ccs811_available_scan_masks[] = {0x3, 0};

static struct iio_chan_spec ccs811_channels[] = {
	{
		.type = IIO_CONCENTRATION,
		.modified = 1,
		.channel2 = IIO_MOD_CO2,
		.info_mask_separate = BIT(IIO_CHAN_INFO_RAW),
		.scan_type = {
			.sign = 'u',
			.realbits = 16,
			.storagebits = 16,
			.endianness = IIO_BE,
		},
	},
	{
		.type = IIO_CONCENTRATION,
		.modified = 1,
		.channel2 = IIO_MOD_VOC,
		.info_mask_separate = BIT(IIO_CHAN_INFO_RAW),
		.scan_type = {
			.sign = 'u',
			.realbits = 16,
			.storagebits = 16,
			.endianness = IIO_BE,
		},
	},
	{}
};


static int ccs811_config(struct ccs811_data *data, int reg, uint8_t val)
{
	int ret = 0;

	ret = i2c_smbus_write_byte_data(data->client, reg, val);
	if (ret < 0) 
		pr_err("CCS811: Write data to the register failed...\n");
	else
		pr_info("CCS811: Write data to the register successfully...\n");
	return ret;
}

static int ccs811_set_measurement_mode(struct i2c_client *client, int mode)
{
	int ret;

	ret = i2c_smbus_write_byte_data(client, CCS811_MEAS_MODE_REG, mode);
	if (ret < 0) {
		dev_err(&client->dev, "CCS811: Set measurement mode failed...\n");
		return ret;
	}
	return 0;
}

static int ccs811_get_measuremnt(struct ccs811_data *data)
{
	__be16 res[2]; 
	int cnt = 11, ret;
	/* While delaying, pooling to make sure if the data in ALG_RESULT_DATA reg is ready */
	while (cnt-- > 0) {
		ret = i2c_smbus_read_byte_data(data->client, CCS811_STATUS_REG);
		if (ret < 0)
			return ret;
		if (ret & CCS811_STATUS_DATARDY)
			break;
		msleep(100);
	}
	if (!(ret & CCS811_STATUS_DATARDY)) {
		pr_err("CCS811: Cannot measuring...\n");
		return -EIO;
	}
	/* If the data is ready, get it */
	i2c_smbus_read_i2c_block_data(data->client, CCS811_ALG_RESULT_DATA_REG, 4, (char *)&res);
	data->eCO2 = res[0];
	data->TVOC = res[1];

	pr_info("CCS811: Measuring has been done!\n");
	return 0;
}

static int ccs811_init(struct i2c_client *client)
{
	int ret;

	/* Read hardware ID to make sure the sensor is truly CCS811 */
	ret = i2c_smbus_read_byte_data(client, CCS811_HW_ID_REG);
	if (ret != CCS811_HW_ID) {
		dev_err(&client->dev, "This hardware is not CCS811!\n");
		return -ENODEV;
	}

	/* Check if application firmware is valid */
	ret = i2c_smbus_read_byte_data(client, CCS811_STATUS_REG);
	if (!(ret & CCS811_STATUS_APP_VALID)) {
		dev_err(&client->dev, "CCS811: No valid application firmware loaded!\n");
		return -EINVAL;
	}
	
	/* Change from boot mode to application mode */
	ret = i2c_smbus_write_byte(client, CCS811_APP_START);
	if (ret < 0)
		return ret;
	ret = i2c_smbus_read_byte_data(client, CCS811_STATUS_REG);
	if (!(ret & CCS811_STATUS_FWMODE_APP)) {
		dev_err(&client->dev, "CCS811: Can't change from boot mode to application mode!\n");
		return -EFAULT;
	}

	/* Set measurement mode */
	ret = ccs811_set_measurement_mode(client, CCS811_MODE1_IAQ_1s);

	dev_info(&client->dev, "CCS811: Initialization was successful!\n");
	return 0;
}

/* read_raw and write_raw functions */
static int ccs811_read_raw(struct iio_dev *indio_dev,
			struct iio_chan_spec const *chan,
			int *val,
			int *val2,
			long mask)
{
	struct ccs811_data *data = iio_priv(indio_dev);

	switch (mask) {
	case IIO_CHAN_INFO_RAW:
		mutex_lock(&data->lock);
		ccs811_get_measuremnt(data);
		mutex_unlock(&data->lock);
		switch (chan->channel2) {
		case IIO_MOD_CO2:
			*val = be16_to_cpu(data->eCO2);
			return IIO_VAL_INT;
		case IIO_MOD_VOC:
			*val = be16_to_cpu(data->TVOC);
			return IIO_VAL_INT;
		default:
			return -EINVAL;
		}
	default:
		return -EINVAL;
	}
	return IIO_VAL_INT;
}

static int ccs811_write_raw(struct iio_dev *indio_dev,
			 struct iio_chan_spec const *chan,
			 int val,
			 int val2,
			 long mask)
{
	return 0;
}



static struct iio_info ccs811_iio_info = {
	.read_raw = ccs811_read_raw,
	.write_raw = ccs811_write_raw,
};

static int ccs811_probe(struct i2c_client *client, const struct i2c_device_id *id)
{
	struct iio_dev *indio_dev;
	struct ccs811_data *data;
	int ret;

	dev_info(&client->dev, "CCS811: Probe function has been called\n");

	/* Allocate the device */
	indio_dev = devm_iio_device_alloc(&client->dev, sizeof(*data));
	if (!indio_dev) {
		dev_err(&client->dev, "CCS811: device alloc failed...\n");
		return -ENOMEM;
	}

	data = iio_priv(indio_dev);
	data->client = client;
	i2c_set_clientdata(client, indio_dev);
	mutex_init(&data->lock);

	indio_dev->info = &ccs811_iio_info;
	indio_dev->currentmode = INDIO_DIRECT_MODE;
	indio_dev->available_scan_masks = ccs811_available_scan_masks;
	indio_dev->channels = ccs811_channels;
	indio_dev->num_channels = ARRAY_SIZE(ccs811_channels);
	
	ret = ccs811_init(client);
	if (ret < 0)
		return ret;
	return devm_iio_device_register(&client->dev, indio_dev);
}

static int ccs811_remove(struct i2c_client *client)
{
	dev_info(&client->dev, "CCS811: the module has been unloaded successfully...\n");
	return 0;
}



static const struct i2c_device_id ccs811_ids[] = {
	{ "lda_ccs811", 0},
	{}
};
MODULE_DEVICE_TABLE(i2c, ccs811_ids);

struct of_device_id ccs811_id_table[] = {
	{
		.compatible = "lda,ccs811",
	},
	{}
};
MODULE_DEVICE_TABLE(of, ccs811_id_table);

static struct i2c_driver ccs811_driver = {
	.driver = {
		.name = "ccs811",
		.of_match_table = ccs811_id_table,
	},
	.probe = ccs811_probe,
	.remove = ccs811_remove,
	.id_table = ccs811_ids,
};

module_i2c_driver(ccs811_driver);

MODULE_AUTHOR("LDA");
MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("CCS811 custom driver made by LDA");
