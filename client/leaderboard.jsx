const { set } = require('mongoose');
const helper = require('./helper.js');
const React = require('react');
const _ = require('underscore');

const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const { Modal, ModalBody, Button, ModalHeader, ModalFooter, Input, InputGroup, Label, Form, Table, Container } = require('reactstrap');
// const { Form, Label, Input } = require('reactstrap');

// import banner1 from '../hosted/img/banner-1.jpg';

const handleNewSubmission = (e, onTimeSubmitted) => {
  e.preventDefault();
  helper.hideError();
  // console.log(e.target.style.backgroundColor);
  // e.target.style.backgroundColor = "red";

  const timeHrs = e.target.querySelector('#hours').value;
  const timeMins = e.target.querySelector('#minutes').value;
  const timeSecs = e.target.querySelector('#seconds').value;
  const timeMs = e.target.querySelector('#milliseconds').value;

  // const time = e.target.querySelector('#completionTime').value;
  const category = e.target.querySelector('#category').value;
  const version = e.target.querySelector('#version').value;
  const difficulty = e.target.querySelector('#difficulty').value;
  const verified = false;

  // console.log(`timeHrs: ${timeHrs}`);
  // console.log(`timeMins: ${timeMins}`);
  // console.log(`timeSecs: ${timeSecs}`);
  // console.log(`timeMs: ${timeMs}`);
  // console.log(`category: ${category}`);
  // console.log(`version: ${version}`);
  // console.log(`difficulty: ${difficulty}`);

  if (!timeHrs || !timeMins || !timeSecs || !timeMs || !category || !version || !difficulty) {
    helper.handleError('All fields are required');
    return false;
  }

  helper.sendPost(e.target.action, { timeHrs, timeMins, timeSecs, timeMs, category, version, difficulty, verified }, onTimeSubmitted);
  return false;
};

// const handleDomo = (e, onDomoAdded) => {
//   e.preventDefault();
//   helper.hideError();

//   const name = e.target.querySelector('#domoName').value;
//   const age = e.target.querySelector('#domoAge').value;
//   const nickname = e.target.querySelector('#domoNickname').value;

//   if (!name || !age || !nickname) {
//     helper.handleError('All fields are required');
//     return false;
//   }

//   helper.sendPost(e.target.action, { name, age, nickname }, onDomoAdded);
//   return false;
// };


const RunForm = (props) => {

  const [modal, setModal] = useState(false);

  const toggleSubmitForm = () => setModal(!modal);
  return (
    <>
      <Button color="success" onClick={toggleSubmitForm}>Submit</Button>
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
                <Input id='hours' type='number' min={0} max={999} name='hours' required />
                <Label htmlFor='hours'>&nbsp; h &nbsp;</Label>
                <Input id='minutes' type='number' min={0} max={59} name='minutes' required />
                <Label htmlFor='minutes'>&nbsp; m &nbsp;</Label>
                <Input id='seconds' type="number" min={0} max={59} name='seconds' required />
                <Label htmlFor="seconds">&nbsp; s &nbsp;</Label>
                <Input id='milliseconds' type="number" name="milliseconds" min={0} max={999} required />
                <Label htmlFor="milliseconds"> &nbsp; ms &nbsp;</Label>
              </InputGroup>
            </div>

            {/* Run category */}
            <div id='runCategory'>
              <Label htmlFor='category'>Category: &nbsp; </Label>
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

  const runNode = runs.map((run, i) => {
    time = `${run.timeHrs}h ${run.timeMins}m ${run.timeSecs}s ${run.timeMs}ms`;
    return (
      <tr key={i} className={run}>
        {/* <img src="/assets/img/domoface.jpeg" alt="domo face" className='domoFace' /> */}
        <td className='place'>{i + 1}</td>
        <td className='runner'>{run.user}</td>
        <td className='time'>{time}</td>
        <td className='category'>{run.category}</td>
        <td className='version'>{run.version}</td>
        <td className='difficulty'>{run.difficulty}</td>
        <td className='verified'>{run.verified ? 'True' : 'False'}</td>
      </tr>
    );
  });

  return (
    <div className='runList'>
      <Table>
        <thead>
          <tr>
            <th>Place</th>
            <th>Runner</th>
            <th>Time</th>
            <th>Category</th>
            <th>Version</th>
            <th>Difficulty</th>
            <th>Verified</th>
          </tr>
        </thead>
        <tbody>
          {runNode}
        </tbody>
      </Table>
    </div>
  );
};

// Keeps track of the total number of users and the total number of submitted runs
// and displays those to the user
const GameStats = (props) => {
  const [numUsers, setNumUsers] = useState(false);
  const [numSubmissions, setNumSubmissions] = useState(false);

  useEffect(() => {
    const getNumUsers = async () => {
      const response = await fetch('/getNumUsers');
      const data = await response.json();
      setNumUsers(data.numUsers);
    };
    getNumUsers();
  }, [props.reloadStats]);

  useEffect(() => {
    const getNumSubmissions = async () => {
      const response = await fetch('/getNumSubmissions');
      const data = await response.json();
      setNumSubmissions(data.numSubmissions);
    }
    getNumSubmissions();
  }, [props.reloadStats]);

  return (
    <Container id='gameStats'>
      <div>
        Users: {numUsers}
      </div>
      <div>
        Submissions: {numSubmissions}
      </div>
    </Container>
  );
};

const RecentRuns = (props) => {
  const [recentRuns, setRecentRuns] = useState(props.recentRuns);

  useEffect(() => {
    const loadRunsFromServer = async () => {
      const response = await fetch('/getRecentRuns');
      const data = await response.json();
      setRecentRuns(data.recentRuns);
    };
    loadRunsFromServer();
  }, [props.reloadRuns]);

  console.log(recentRuns);
  const runNode = recentRuns.map((run, i) => {
    time = `${run.timeHrs}h ${run.timeMins}m ${run.timeSecs}s ${run.timeMs}ms`;
    return (
      <div key={i} className={run}>
        {/* <img src="/assets/img/domoface.jpeg" alt="domo face" className='domoFace' /> */}
        {/* <div className='place'>{i + 1}</div> */}
        <div className='runner'>{run.user}</div>
        <div className='time'>{time}</div>
        <div className='category'>{run.category}</div>
        <div className='version'>{run.version}</div>
        <div className='difficulty'>{run.difficulty}</div>
        <div className='verified'>{run.verified ? 'True' : 'False'}</div>
      </div>
    );
  });

  return (
    <Container>
      {runNode}
    </Container>
  )
};

const Advertisement = (props) => {

  const images = [
    '/assets/img/banner-1.jpg',
    '/assets/img/banner-2.jpg',
    '/assets/img/banner-3.jpg',
    '/assets/img/banner-4.jpg',
    '/assets/img/banner-5.jpg',
    '/assets/img/banner-6.jpg'
  ];

  const [currImg, setCurrImg] = useState(images[0]);
  const [isPremium, setIsPremium] = useState(false);

  const toggleIsPremium = () => setIsPremium(!isPremium);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrImg(images[_.random(images.length - 1)]);
    }, 15000)

    return () => clearInterval(interval);
  }, []);

  // const premiumToggle =
  return (
    <div>
      <input type="checkbox" name="premium" id="togglePremium" onChange={toggleIsPremium} />
      {
        isPremium ?
          <></> :
          <img src={currImg} alt="imag" />
      }
    </div>
  );
};

const App = () => {
  const [reloadRuns, setReloadRuns] = useState(false);
  const [reloadStats, setReloadStats] = useState(false);
  const [reloadRecentRuns, setReloadRecentRuns] = useState(false);

  return (
    <div>
      <div className='ad'>
        <Advertisement />
      </div>
      <div id='submitRun'>
        <RunForm triggerReload={() => {
          setReloadRuns(!reloadRuns);
          setReloadStats(!reloadStats);
          setReloadRecentRuns(!reloadRecentRuns)
        }} />
      </div>
      <div className='col-8'>
        <div id='runs'>
          <RunList runs={[]} reloadRuns={reloadRuns} />
        </div>
      </div>
      <div className='col-4'>
        <div id='stats'>
          <GameStats reloadStats={reloadStats} />
        </div>
        <div id='recentRuns'>
          <RecentRuns recentRuns={[]} reloadRecentRuns={reloadRecentRuns} />
        </div>
      </div>
    </div>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render(<App />)
};
window.onload = init;
