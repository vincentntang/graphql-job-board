import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import { jobs } from './fake-data';
import {loadJob} from './requests';

export class JobDetail extends Component {
  constructor(props) {
    super(props);
    // this.state = {job: jobs.find((job) => job.id === jobId)};
    this.state = {job: null}
  }

  async componentDidMount() {
    const {jobId} = this.props.match.params;
    console.log(jobId + "jobID")
    const job = await loadJob(jobId)
    this.setState({job});
  }

  render() {
    const {job} = this.state;
    if (!job) {
      return null;
    }
    return (
      <div>
        <h1 className="title">{job.title}</h1>
        <h2 className="subtitle">
          <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
        </h2>
        <div className="box">{job.description}</div>
      </div>
    );
  }
}
