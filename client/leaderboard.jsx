const helper = require('./helper.js');
const React = require('react');

const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const { Modal, ModalBody, Button, ModalHeader, ModalFooter, Input, InputGroup, Label, Form } = require('reactstrap');
// const { Form, Label, Input } = require('reactstrap');

const handleNewSubmission = (e, onTimeSubmitted) => {
  e.preventDefault();
  helper.hideError();
  // console.log(e.target.style.backgroundColor);
  // e.target.style.backgroundColor = "red";

  const timeHrs = e.target.querySelector('#hours').value;
  const timeMins = e.target.querySelector('#minutes').value;
  const timeSecs = e.target.querySelector('#seconds').value;
  const timeMs = e.target.querySelector('#milliseconds').value;

  let time = '';

  if (timeHrs !== 0) {
    time += `${timeHrs}:`;
  }
  time += `${timeMins}:${timeSecs}.${timeMs}`;

  // const time = e.target.querySelector('#completionTime').value;
  const category = e.target.querySelector('#category').value;
  const version = e.target.querySelector('#version').value;
  const difficulty = e.target.querySelector('#difficulty').value;
  const verified = false;

  console.log(`timeHrs: ${timeHrs}`);
  console.log(`timeMins: ${timeMins}`);
  console.log(`timeSecs: ${timeSecs}`);
  console.log(`timeMs: ${timeMs}`);
  console.log(`category: ${category}`);
  console.log(`version: ${version}`);
  console.log(`difficulty: ${difficulty}`);

  if (!timeHrs || !timeMins || !timeSecs || !timeMs || !category || !version || !difficulty) {
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

  const [modal, setModal] = useState(false);

  const toggleSubmitForm = () => setModal(!modal);
  return (
    <>
      <button onClick={toggleSubmitForm}>Submit</button>
      <Modal isOpen={modal} toggle={toggleSubmitForm}>
        <ModalHeader toggle={toggleSubmitForm}>Submit Run</ModalHeader>
        <ModalBody>
          <form id='submissionForm'
            onSubmit={(e) => {
              toggleSubmitForm();
              handleNewSubmission(e, props.triggerReload);
            }}
            name='submissionForm'
            action='/addRun'
            method='POST'
            className='submissionForm'
          >
            <div id='completionTime'>
              <InputGroup>
                <Input id='hours' type='number' min={0} max={999} name='hours' />
                <Label htmlFor='hours'>&nbsp; h &nbsp;</Label>
                <Input id='minutes' type='number' min={0} max={59} name='minutes' />
                <Label htmlFor='minutes'>&nbsp; m &nbsp;</Label>
                <Input id='seconds' type="number" min={0} max={59} name='seconds' />
                <Label htmlFor="seconds">&nbsp; s &nbsp;</Label>
                <Input id='milliseconds' type="number" name="milliseconds" min={0} max={999} />
                <Label htmlFor="milliseconds"> &nbsp; ms &nbsp;</Label>
              </InputGroup>
            </div>

            {/* Run category */}
            <div id='runCategory'>
              <label htmlFor='category'>Category: &nbsp; </label>
              <select id='category' type='select' name='category' placeholder='Any% RSG'>
                <option value="Any% RSG">Any% RSG</option>
                <option value="Any% SSG">Any% SSG</option>
                <option value="AA RSG">AA RSG</option>
                <option value="AA SSG">AA SSG</option>
              </select>
            </div>

            {/* Game version */}
            <div id='gameVersion'>
              <Label htmlFor='version'>Version: &nbsp;</Label>
              <select name="version" id="version">
                <option value="Pre 1.8">Pre 1.8</option>
                <option value="1.8">1.8</option>
                <option value="1.9-1.12">1.9-1.12</option>
                <option value="1.13-1.15">1.13-1.15</option>
                <option value="1.16+">1.16+</option>
              </select>
            </div>

            {/* Game difficulty */}
            <div id='gameDifficulty'>
              <Label htmlFor='difficulty'>Difficulty: </Label>
              <select name="difficulty" id="difficulty">
                <option value="Easy">Easy</option>
                <option value="Normal">Normal</option>
                <option value="Hard">Hard</option>
                <option value="Hardcore">Hardcore</option>
                <option value="Peaceful">Peaceful</option>
              </select>
            </div>
            <Button type='submit' color="success" className='btn' onSubmit={(e) => handleNewSubmission(e, props.triggerReload)}>
              Submit
            </Button>
          </form>
        </ModalBody>
        <ModalFooter>
          {' '}
          <Button color="secondary" onClick={toggleSubmitForm}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal >
    </>
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
        <RunForm triggerReload={() => setReloadRuns(!reloadRuns)} />
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
