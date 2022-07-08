FROM browserless/chrome

RUN npm i @adobe/cgroup-metrics

COPY hardware-monitoring.js build/hardware-monitoring.js
