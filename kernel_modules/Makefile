obj-m += hdc1080.o ccs811.o

ARCH:=arm
CROSS_COMPILE:=arm-none-linux-gnueabihf-
KERNEL_DIR:=/home/lda/Source_codes/Linux_kernel/linux-5.10/
BBB_IP:=192.168.101.69

modules clean:
	make ARCH=$(ARCH) CROSS_COMPILE=$(CROSS_COMPILE)  -C $(KERNEL_DIR) M=$(PWD) $@
send:
	scp hdc1080.ko ccs811.ko debian@$(BBB_IP):/home/debian/DoAn_HTN/kernel_modules


