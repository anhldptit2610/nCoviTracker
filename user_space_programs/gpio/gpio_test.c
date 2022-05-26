#include <stdio.h>
#include <iobb.h>

int main(void)
{
    iolib_init();
    iolib_setdir(8, 12, DigitalOut);
    while (1) {
        pin_high(8, 12);
        iolib_delay_ms(1000);
        pin_low(8, 12);
        iolib_delay_ms(1000);
    }
    iolib_free();
    return 0;
}