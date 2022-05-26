#include <stdio.h>
#include <mosquitto.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <errno.h>

void mosq_log_callback(struct mosquitto *mosq, void *userdata, int level, const char *str)
{
    switch (level) {
    case MOSQ_LOG_WARNING:
    case MOSQ_LOG_ERR:
        printf("%i:%s\n", level, str);
        break;
    }
}

struct mosquitto *mosq = NULL;
char *topic = NULL;

void mqtt_setup(void)
{
    char *host = "localhost";
    int port = 1883;
    int keepalive = 60;
    bool clean_session = true;

    topic = "test/t1";

    mosquitto_lib_init();
    mosq = mosquitto_new(NULL, clean_session, NULL);
    if (!mosq) {
        fprintf(stderr, "Error: Out of memory\n");
        exit(1);
    }
    mosquitto_log_callback_set(mosq, mosq_log_callback);

    if (mosquitto_connect(mosq, host, port, keepalive)) {
        fprintf(stderr, "Unable to connect.\n");
        exit(1);
    }
    int loop = mosquitto_loop_start(mosq);
    if (loop != MOSQ_ERR_SUCCESS) {
        fprintf(stderr, "Unable to start loop: %i\n", loop);
        exit(1);
    }
}

int mqtt_send(char *msg)
{
    return mosquitto_publish(mosq, NULL, topic, strlen(msg), msg, 0, 0);
}

int main(int argc, char **argv)
{
    int fd, ret;
    char buf[5];

    mqtt_setup();
    fd = open("/sys/bus/iio/devices/iio:device0/in_temp_raw", O_RDONLY);
    if (fd == -1) {
        fprintf(stderr, "Open file failed\n");
        return -1;
    }
    
    if ((ret = read(fd, buf, 5)) == -1) {
        fprintf(stderr, "read\n");
        return -1;
    }
    while (1) {
        buf[ret] = '\0';
        mqtt_send(buf);
        usleep(1000000);
    }
    return 0;
}