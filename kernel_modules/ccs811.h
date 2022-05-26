/* CCS811 register */
#define CCS811_STATUS_REG 			0x00 /* Status register */
#define CCS811_STATUS_DATARDY 			BIT(3)

#define CCS811_MEAS_MODE_REG 			0x01 /* Measurement mode and conditions register */
#define CCS811_ALG_RESULT_DATA_REG 		0x02 /* Stores the result of algorithm: eCO2 level and total VOC level */
#define CCS811_RAW_DATA_REG 			0x03 /* Raw ADC data values */
#define CCS811_ENV_DATA_REG 			0x05 /* Use for enabling compensation */
#define CCS811_NTC_REG 				0x06 /* Provide the voltages to determine the ambient temperature */
#define CCS811_THRESHOLDS_REG 			0x10 /* Thresholds for operation of the sensor */
#define CCS811_BASELINE_REG 			0x11 /* We can read current baseline value by using this register */

#define CCS811_HW_ID_REG 			0x20 /* Use to identify if the device truly is CCS811 */
#define CCS811_HW_ID 				0x81

#define CCS811_HW_VER_REG 			0x21 /* Show the hardware version */
#define CCS811_HW_VER 				0x10

#define CCS811_FW_BOOT_VER_REG 			0x23 /* Show the firmware boot version */
#define CCS811_FW_APP_VER_REG 			0x24 /* Show the firmware application version */
#define CCS811_ERROR_ID_REG 			0xE0 /* Errors ID stored here */
#define CCS811_SW_RESET_REG 			0xFF /* Use to reset the sensor and return to BOOT mode when writing correctly 4 bytes */

/* Measurement modes */
#define CCS811_MODE0 			0x0
#define CCS811_MODE1_IAQ_1s 		0x10
#define CCS811_MODE2_IAQ_10s 		0x20
#define CCS811_MODE3_IAQ_60s 		0x30

/* Status register */
#define CCS811_STATUS_APP_VALID 	BIT(4)
#define CCS811_STATUS_FWMODE_APP	BIT(7)

/* Bootloader register */
#define CCS811_APP_START 			0xF4
