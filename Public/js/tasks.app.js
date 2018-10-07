var tasksApp = new Vue({
  el: '#taskMain',
  data: {
    task: {
      id: 0,
      title: 'foo',
      type : '',
      size : '',
      team : '',
      status: '',
      start_date: '',
      close_date: null,
      hours_worked: '',
      perc_complete: '',
      current_sprint : ''
    },
    work: [ ],
      // {
      //   id: 0,
      //   start: '',
      //   stop: '',
      //   hours: '',
      //   completion_estimate: ''
      // }

    workForm: { },
    teamList: [ ]
  },
  computed: {
    workSpan () {
      return moment(this.workForm.stop)
             .diff(moment(this.workForm.start + ' ' + this.workForm.start_time), 'hours', true)
             .toFixed(1);
           }
  },
  methods: {
    handleWorkForm(e) {
      // TODO: Check validity
      //e.preventDefault();
      //console.log(e);
      if (this.workSpan <= 0) {
        console.error ("Invalid work period.")
      }

      this.workForm.start_date = this.workForm.start + ' ' + this.workForm.start_time;
      this.workForm.hours = this.workSpan;

      // TODO: Calculate hours
      // something like:  moment.duration(end.diff(startTime)).asHours();

      //TODO: clone workForm
      const s = JSON.stringify(this.workForm);
      console.log(s);
      //TODO: POST to remote server
      fetch('api/work.php', {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: s
      })
      //TODO: Append result
      .then( response => response.json() )
      .then( json => {this.work.push(json)})
      .catch( err => {
        console.error('WORK POST ERROR:');
        console.error(err);
      })

      // Reset workForm
      this.workForm = this.getEmptyWorkForm();
    },
    sumHours() {
      return this.work.reduce(
        (sum, current) => sum + current.hours,
        0
      )
    },
    diffAsHours() {
      return 0 //moment().duration(end.diff(startTime)).asHours();
    },
    dateFormat(d) {
      d = d || moment();
      return moment(d).format('YYYY-MM-DD');
    },
    timeFormat(d) {
      d = d || moment();
      return moment(d).format('HH:mm');
    },
    getEmptyWorkForm() {
      return {
        start: this.dateFormat(),
        start_time: this.timeFormat(),
        stop: this.dateFormat(),
        stop_time: this.timeFormat(),
        team_id: null,
        task_id: this.task.id,
        completion_estimate: 0
      }
    },
    prettyDate(d) {
      return moment(d).format('YYYY-MM-DD HH:MM')
    }
  },
  created () {
    this.workForm = this.getEmptyWorkForm();
    console.log(window.location.href);

    const url = new URL(window.location.href);
    const taskId = url.searchParams.get("taskId");


    console.log('Task: '+ taskId);
    this.task.id = taskId;
    if (!taskId) {
      //TODO: Error? 404?
      //e.g., window.location = '404.html';
    }
    this.workForm = this.getEmptyWorkForm();
    
    fetch('api/work.php?taskId='+taskId)
    .then( response => response.json() )
    .then( json => {tasksApp.work = json} )
    .catch( err => {
      console.log('WORK FETCH ERROR:');
      console.log(err);
    })

    fetch('api/team.php')
    .then( response => response.json() )
    .then( json => {tasksApp.teamList = json} )
    .catch( err => {
      console.log('TEAM LIST ERROR:');
      console.log(err);
    })
  }
})
