#include <linux/kernel.h>
#include <linux/module.h>
#include <linux/init.h>
#include <linux/mod_devicetable.h>
#include <linux/i2c.h>
#include <linux/of.h>
#include <linux/mutex.h>
#include <linux/delay.h>


#include <linux/iio/iio.h>
#include <linux/iio/sysfs.h>

#define HDC1080_TEMP_REG 		0x00
#define HDC1080_HUMID_REG 		0x01
#define HDC1080_CONFIG_REG 		0x02
#define HDC1080_ACQUISITION_SINGLE 	~BIT(12)
#define HDC1080_ACQUISITION_BOTH 	BIT(12)


uint16_t hdc1080_conversion_time[2][3] = {
	{6350, 3650, 0}, 		/* temperature sensor */
	{6500, 3850, 2500},             /* humidity sensor    */
};

static const struct {
	uint8_t shift;
	uint8_t mask;
} hdc1080_resolution_shift[2] = {
	{ /* temperature channel */
		.shift = 10,
		.mask = 1,
	},
	{ /* humidity channel */
		.shift = 8,
		.mask = 3,
	}
};	

struct hdc1080_data {
	struct i2c_client *client;
	struct mutex lock;

	uint16_t conversion_time[2];

};

static const struct iio_chan_spec hdc1080_chan_spec[] = {
	{
		.type = IIO_TEMP,
		.info_mask_separate = BIT(IIO_CHAN_INFO_RAW),
		.address = HDC1080_TEMP_REG,
		.scan_type = {
			.storagebits = 16,
			.realbits = 16,
		},
	},
	{
		.type = IIO_HUMIDITYRELATIVE,
		.info_mask_separate = BIT(IIO_CHAN_INFO_RAW),
		.address = HDC1080_HUMID_REG,
		.scan_type = {
			.storagebits = 16,
			.realbits = 16,
		},
	},	
};

static const unsigned long hdc1080_available_scan_masks[] = {0x3, 0};

int hdc1080_config(struct hdc1080_data *hdc1080, uint16_t val)
{
	int ret;

	ret = i2c_smbus_write_word_swapped(hdc1080->client, HDC1080_CONFIG_REG, val);
	if (!ret) 
		pr_info("HDC1080: Configuration was successfully...\n");
	else 
		pr_info("HDC1080: Configuration was failed...\n");
	return ret;
}

int hdc1080_set_conversion_time(struct hdc1080_data *hdc1080, int chan, uint16_t val)
{
	int ret = 0;
	int i;
	uint16_t tmp_val;

	for (i = 0; i < ARRAY_SIZE(hdc1080_conversion_time[chan]); i++)	{
		if (val == hdc1080_conversion_time[chan][i]) {
			pr_info("HDC1080: resolution of channel %d is %d...\n", chan, hdc1080_conversion_time[chan][i]);
			tmp_val = (hdc1080_resolution_shift[chan].mask & i) << hdc1080_resolution_shift[chan].shift;
			ret = hdc1080_config(hdc1080, tmp_val);
			if (!ret)
				hdc1080->conversion_time[chan] = val;
			break;
		}
	}
	return ret;
}

int hdc1080_get_measurement(struct hdc1080_data *hdc1080, struct iio_chan_spec const *chan)
{
	__be16 res;

	int delay = hdc1080->conversion_time[chan->address] + 1*USEC_PER_MSEC, ret;
	pr_info("HDC1080: Start measuring...\n");
	
	/* First send the acquisition signal */
	ret = i2c_smbus_write_byte(hdc1080->client, chan->address);
	if (ret < 0) {
		pr_info("HDC1080: Cannot start measurement...\n");
		return ret;
	}
	usleep_range(delay, delay + 1000);
	
	/* Then get the result of the acquisition */
	ret = i2c_master_recv(hdc1080->client, (char *)&res, sizeof(res)); 
	if (ret < 0) {
		pr_err("HDC1080: Cannot read sensor data...\n");
		return ret;
	} else 
		pr_info("HDC1080: Measurement has been done...\n");
	return be16_to_cpu(res);
}

int hdc1080_read_raw(struct iio_dev *indio_dev,
			struct iio_chan_spec const *chan,
			int *val,
			int *val2,
			long mask)
{
	struct hdc1080_data *hdc1080 = iio_priv(indio_dev);
	uint16_t ret;

	switch (mask)
	{
		case IIO_CHAN_INFO_RAW:
			mutex_lock(&hdc1080->lock);
			ret = hdc1080_get_measurement(hdc1080, chan);
			if (ret >= 0) {
				mutex_unlock(&hdc1080->lock);
				*val = ret;
				return IIO_VAL_INT;
			}
			else 
				pr_info("HDC1080: Measuring has been failed...\n");
			break;
	};
	return 0;
}

int hdc1080_write_raw(struct iio_dev *indio_dev,
			 struct iio_chan_spec const *chan,
			 int val,
			 int val2,
			 long mask)
{
	return 0;
}

struct iio_info hdc1080_iio_info = {
	.read_raw = hdc1080_read_raw,
	.write_raw = hdc1080_write_raw,
};

static int hdc1080_probe(struct i2c_client *client, const struct i2c_device_id *id)
{
	struct iio_dev *indio_dev;
	struct hdc1080_data *hdc1080;
	int ret;

	/* Allocate iio device */
	indio_dev = devm_iio_device_alloc(&client->dev, sizeof(*hdc1080));
	if (!indio_dev) {
		dev_info(&client->dev, "IIO device allocating failed...\n");
		goto iio_device_alloc_failed;
	}

	hdc1080 = iio_priv(indio_dev); 		/* Get the driver's private data */
	hdc1080->client = client;
	mutex_init(&hdc1080->lock);
	
	/* Fill in indio_dev fields */
	indio_dev->currentmode = INDIO_DIRECT_MODE;
	indio_dev->available_scan_masks = hdc1080_available_scan_masks;
	indio_dev->channels = hdc1080_chan_spec;
	indio_dev->num_channels = ARRAY_SIZE(hdc1080_chan_spec);
	indio_dev->info = &hdc1080_iio_info;
	
	i2c_set_clientdata(client, indio_dev);

	/* set conversion time for each channel */
	ret = hdc1080_set_conversion_time(hdc1080, 0, hdc1080_conversion_time[0][0]);
	if (ret < 0) {
		dev_info(&client->dev, "Set conversion time failed...\n");
		return -EFAULT;
	}
	ret = hdc1080_set_conversion_time(hdc1080, 1, hdc1080_conversion_time[1][0]);
	if (ret < 0) {
		dev_info(&client->dev, "Set conversion time failed...\n");
		return -EFAULT;
	}
	
	/* set acquisition mode */
	ret = i2c_smbus_write_word_data(hdc1080->client, HDC1080_CONFIG_REG, HDC1080_ACQUISITION_BOTH);
	if (ret < 0) {
		dev_info(&client->dev, "Cannot set acquisition time...\n");
		return ret;
	}

	dev_info(&client->dev, "Probe is successful...\n");

	return devm_iio_device_register(&client->dev, indio_dev);

iio_device_alloc_failed:
	return -ENOMEM;
	
}

static int hdc1080_remove(struct i2c_client *client)
{
	dev_info(&client->dev, "The module has been unloaded.\n");
	return 0;
}

/* list of devices */

static const struct i2c_device_id hdc1080_ids[] = {
	{"lda_hdc1080", 0}, 
	{}
};
MODULE_DEVICE_TABLE(i2c, hdc1080_ids);

static struct of_device_id hdc_of_match[] = {
	{.compatible = "lda,hdc1080", },
	{ },
};
MODULE_DEVICE_TABLE(of, hdc_of_match);

static struct i2c_driver hdc1080_driver = {
	.driver = {
		.name = "hdc1080",
		.owner = THIS_MODULE,
		.of_match_table = of_match_ptr(hdc_of_match),
	},
	.probe = hdc1080_probe,
	.remove = hdc1080_remove,
	.id_table = hdc1080_ids,
};

module_i2c_driver(hdc1080_driver);

MODULE_AUTHOR("LDA");
MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("hdc1080 kernel module");
