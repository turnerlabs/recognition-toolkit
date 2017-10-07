FROM recognition-toolkit-core
ADD . /opt/recognition-toolkit/
WORKDIR /opt/recognition-toolkit/
RUN npm run build
CMD ["npm", "run", "start-prod"]