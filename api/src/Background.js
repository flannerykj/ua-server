const NR = require('node-resque');
const redis = require('redis');
const schedule = require('node-schedule');

class Background {
  constructor(client) {
    this.client = client;
    /* eslint-disable new-cap */
    this.worker = new NR.Worker({ connection: { redis: this.client }, queues: ['main'] }, this.jobs);
    this.scheduler = new NR.Scheduler({ connection: { redis: this.client } });
    this.queue = new NR.Queue({ connection: { redis: this.client } }, this.jobs);
    /* eslint-enable new-cap */
  }

  get jobs() {
    return {};
  }

  initialize() {
    this.worker.connect(() => {
      this.worker.workerCleanup(); // optional: cleanup any previous improperly shutdown workers on this host
      this.worker.start();
    });

    this.scheduler.connect(() => {
      this.scheduler.start();
    });

    this.queue.connect(() => {
      schedule.scheduleJob('0 23 * * *', () => {
        if (this.scheduler.master) {
          console.log('>>> enquing a job');
          this.queue.enqueue('main', 'sendUploadNotifications');
        }
      });
    });

    /* eslint-disable max-len */
    this.worker.on('start', () => { console.log('worker started'); });
    this.worker.on('end', () => { console.log('worker ended'); });
    this.worker.on('cleaning_worker', (worker) => { console.log(`cleaning old worker ${worker}`); });
    // this.worker.on('poll', function (queue) { console.log('worker polling ' + queue) })
    this.worker.on('job', (queue, job) => { console.log(`working job ${queue} ${JSON.stringify(job)}`); });
    this.worker.on('reEnqueue', (queue, job, plugin) => { console.log(`reEnqueue job (${plugin}) ${queue} ${JSON.stringify(job)}`); });
    this.worker.on('success', (queue, job, result) => { console.log(`job success ${queue} ${JSON.stringify(job)} >> ${result}`); });
    this.worker.on('failure', (queue, job, failure) => { console.log(`job failure ${queue} ${JSON.stringify(job)} >> ${failure}`); });
    this.worker.on('error', (queue, job, error) => { console.log(`error ${queue} ${JSON.stringify(job)} >> ${error}`); });
    // this.worker.on('pause', function () { console.log('worker paused') })

    this.scheduler.on('start', () => { console.log('scheduler started'); });
    this.scheduler.on('end', () => { console.log('scheduler ended'); });
    // this.scheduler.on('poll', function () { console.log('scheduler polling') })
    this.scheduler.on('master', () => { console.log('scheduler became master'); });
    this.scheduler.on('error', (error) => { console.log(`scheduler error >> ${error}`); });
    this.scheduler.on('working_timestamp', (timestamp) => { console.log(`scheduler working timestamp ${timestamp}`); });
    this.scheduler.on('transferred_job', (timestamp, job) => { console.log(`scheduler enquing job ${timestamp} >> ${JSON.stringify(job)}`); });

    this.queue.on('error', (error) => { console.log(error); });
    /* eslint-enable max-len */
    process.on('SIGTERM', this.shutdown.bind(this));
    process.on('SIGINT', this.shutdown.bind(this));
  }

  shutdown() {
    this.scheduler.end(() => {
      this.worker.end(() => {
        console.log('resque shutting down.');
        process.exit();
      });
    });
  }
}

const redisClient = redis.createClient(6379, 'redis', {
});
redisClient.select(0);
let background = new Background(redisClient);

module.exports = background;
