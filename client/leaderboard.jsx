const helper = require('./helper.js');
const React = require('react');

const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const { Form, Label, Input } = require('reactstrap');

const handleNewSubmission = (e, onTimeSubmitted) => {
  e.preventDefault();
  helper.hideError();

  const time = e.target.querySelector('#completionTime').value;
  const category = e.target.querySelector('#category').value;
  const version = e.target.querySelector('#version').value;
  const difficulty = e.target.querySelector('#difficulty').value;
  // const verified = false;

  if (!time || !category || !version || !difficulty) {
    helper.handleError('All fields are required');
    return false;
  }

  helper.sendPost(e.target.action, { time, category, version, difficulty, verified: false }, onTimeSubmitted);
  return false;
};

const handleDomo = (e, onDomoAdded) => {
  e.preventDefault();
  helper.hideError();

  const name = e.target.querySelector('#domoName').value;
  const age = e.target.querySelector('#domoAge').value;
  const nickname = e.target.querySelector('#domoNickname').value;

  if (!name || !age || !nickname) {
    helper.handleError('All fields are required');
    return false;
  }

  helper.sendPost(e.target.action, { name, age, nickname }, onDomoAdded);
  return false;
};

// const handleDelete = (e, onDomoDeleted) => {
//   e.preventDefault();
//   helper.hideError();

//   const name = e.target.querySelector('#delDomoName').value;
//   const nickname = e.target.querySelector("#delDomoNickname").value;
//   const age = e.target.querySelector("#delDomoAge").value;

//   if (!name || !nickname || !age) {
//     helper.handleError('All fields are required.');
//     return false;
//   }

//   helper.sendDelete(e.target.action, { name, age, nickname }, onDomoDeleted);
//   return false;
// }
const RunForm = (props) => {
  return (
    <div>
      <Form id='submissionForm'
        onSubmit={(e) => handleNewSubmission(e, props.triggerReload)}
        name='submissionForm'
        action='/submitTime'
        method='POST'
        className='submissionForm'
      >
        <Label htmlFor='time'>Time: </Label>
        <Input id='completionTime' type='text' name='time' placeholder='7:15.244' />
        <Label htmlFor='category'>Category: </Label>
        <Input id='category' type='select' name='category' placeholder='Any% RSG' />
        <Label htmlFor='version'>Version: </Label>
        <Input id='version' type='select' name='version' placeholder='1.16+' />
        <Label htmlFor='difficulty'>Difficulty: </Label>
        <Input id='difficulty' type='select' name='difficulty' placeholder='Easy' />
        <Input className='submitBtn' type='submit' value="Submit Time" />
      </Form>
      {/* <form id='deleteDomoForm'
        onSubmit={(e) => handleDelete(e, props.triggerReload)}
        name='deleteDomoForm'
        action='/deleteDomo'
        method='DELETE'
        className='deleteDomoForm'
      >
        <label htmlFor='name'>Name: </label>
        <input id='delDomoName' type='text' name='name' placeholder='Domo Name' />
        <label htmlFor='nickname'>Nickname: </label>
        <input id='delDomoNickname' type='text' name='Nickname' placeholder='Domo Nickname' />
        <label htmlFor='age'>Age: </label>
        <input id='delDomoAge' type='number' min='0' name='age' />
        <input className='deleteDomoSubmit' type='submit' value="Delete Domo" />
      </form> */}
    </div>
  );
};

const RunList = (props) => {
  const [runs, setRuns] = useState(props.runs);

  useEffect(() => {
    const loadRunsFromServer = async () => {
      const response = await fetch('/getRuns');
      const data = await response.json();
      setRuns(data.runs);
    };
    loadRunsFromServer();
  }, [props.reloadRuns]);

  if (runs.length === 0) {
    return (
      <div className='runList'>
        <h3 className='emptyLb'>No Submissions Yet!</h3>
      </div>
    );
  }

  const runNode = runs.map(run => {
    return (
      <div key={run.id} className='run'>
        <img src="/assets/img/domoface.jpeg" alt="domo face" className='domoFace' />
        <h3 className='runner'>Runner: {run.user}</h3>
        <h3 className='time'>Time: {run.time}</h3>
        <h3 className='category'>Category: {run.category}</h3>
        <h3 className='version'>Version: {run.version}</h3>
        <h3 className='difficulty'>Difficulty: {run.difficulty}</h3>
      </div>
    );
  });

  return (
    <div className='runList'>
      {runNode}
    </div>
  );
};

const App = () => {
  const [reloadRuns, setReloadRuns] = useState(false);

  return (
    <div>
      <div id='submitRun'>
        <SubmissionForm triggerReload={() => setReloadRuns(!reloadRuns)} />
      </div>
      <div id='runs'>
        <RunList runs={[]} reloadRuns={reloadRuns} />
      </div>
    </div>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render(<App />)
};
window.onload = init;
