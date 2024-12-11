const { set } = require('mongoose');
const helper = require('./helper.js');
const React = require('react');
const _ = require('underscore');

const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const { Modal, ModalBody, Button, ModalHeader, ModalFooter, Input, InputGroup, Label, Table, Container } = require('reactstrap');

const handleNewSubmission = (e, onTimeSubmitted) => {
  e.preventDefault();
  helper.hideError();

  const timeHrs = e.target.querySelector('#hours').value;
  const timeMins = e.target.querySelector('#minutes').value;
  const timeSecs = e.target.querySelector('#seconds').value;
  const timeMs = e.target.querySelector('#milliseconds').value;

  const category = e.target.querySelector('#category').value;
  const version = e.target.querySelector('#version').value;
  const difficulty = e.target.querySelector('#difficulty').value;
  const isPrivate = e.target.querySelector('#isPrivate').checked;

  console.log(isPrivate);

  if (!timeHrs || !timeMins || !timeSecs || !timeMs || !category || !version || !difficulty) {
    helper.handleError('All fields are required');
    return false;
  }

  helper.sendPost(e.target.action, { timeHrs, timeMins, timeSecs, timeMs, category, version, difficulty, isPrivate }, onTimeSubmitted);
  return false;
};


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

            <div id='submissionPrivacy'>
              <Label htmlFor="isPrivate">Private? &nbsp;</Label>
              <input type='checkbox' name='isPrivate' id='isPrivate' />
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
        <td className='place'>{i + 1}</td>
        <td className='runner'>{run.user}</td>
        <td className='time'>{time}</td>
        <td className='category'>{run.category}</td>
        <td className='version'>{run.version}</td>
        <td className='difficulty'>{run.difficulty}</td>
        <td className='isPrivate'>{run.isPrivate}</td>
      </tr>
    );
  });

  return (
    <div className='runList'>
      <Table color='success'>
        <thead>
          <tr>
            <th>Place</th>
            <th>Runner</th>
            <th>Time</th>
            <th>Category</th>
            <th>Version</th>
            <th>Difficulty</th>
            <th>Private</th>
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
    <div id='gameStats' className='margin-sides'>
      <div className='has-text-black has-text-centered'>
        Game Stats
      </div>
      <div className='has-text-centered has-text-black'>
        <div>
          Users: {numUsers}
        </div>
        <div>
          Submissions: {numSubmissions}
        </div>
      </div>
    </div>
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
      <div key={i} className={run} id='runNode'>
        <div className='runner'>User: {run.user}</div>
        <div className='time'>Time: {time}</div>
        <div className='category'>Category: {run.category}</div>
        <div className='version'>Version: {run.version}</div>
        <div className='difficulty'>Difficulty: {run.difficulty}</div>
      </div>
    );
  });

  return (
    <div className='recentRun margin-sides has-text-centered is-half-width has-text-black margin-top'>
      <h3 className='has-text-weight-bold is-half'>Recent Run</h3>
      {runNode}
    </div>
  )
};

// Displays an ad on the page (as well as the premium toggle)
const Advertisement = () => {

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
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container className='container is-centered has-background-green block'>
      <div className='is-size-5 has-text-black'>
        <label htmlFor='premium'>Premium? &nbsp; </label>
        <input type="checkbox" name="premium" id="toggle-premium" className='checkbox is-size-5' onChange={toggleIsPremium} />
      </div>
      {
        isPremium ?
          <></> :
          <img className='image' src={currImg} alt="imag" />
      }
    </Container>
  );
};

const App = () => {
  const [reloadRuns, setReloadRuns] = useState(false);
  const [reloadStats, setReloadStats] = useState(false);
  const [reloadRecentRuns, setReloadRecentRuns] = useState(false);

  return (
    <div>
      <div className='ad'>
        <Advertisement className='smaller' />
      </div>
      <div id='submitRun'>
        <RunForm triggerReload={() => {
          setReloadRuns(!reloadRuns);
          setReloadStats(!reloadStats);
          setReloadRecentRuns(!reloadRecentRuns)
        }} />
      </div>
      <div className=''>
        <div id='runs'>
          <RunList runs={[]} reloadRuns={reloadRuns} className='left-margin' />
        </div>
      </div>
      <div id='stats is-inline-flex'>
        <GameStats reloadStats={reloadStats} className='is-flex' />
        <RecentRuns recentRuns={[]} reloadRecentRuns={reloadRecentRuns} className='is-flex' />
      </div>
      <div id='recentRuns'>
      </div>
    </div>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render(<App />)
};
window.onload = init;
