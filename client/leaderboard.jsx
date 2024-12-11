const { set } = require('mongoose');
const helper = require('./helper.js');
const React = require('react');
const _ = require('underscore');

const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const { Modal, ModalBody, Button, ModalHeader, Input, InputGroup, Label, Table, Container } = require('reactstrap');

// Pulls the data about the run from the form and sends a request to the server to store the data
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

  if (!timeHrs || !timeMins || !timeSecs || !timeMs || !category || !version || !difficulty) {
    helper.handleError('All fields are required');
    return false;
  }

  helper.sendPost(e.target.action, { timeHrs, timeMins, timeSecs, timeMs, category, version, difficulty }, onTimeSubmitted);
  return false;
};


const RunForm = (props) => {

  const [modal, setModal] = useState(false);

  const toggleSubmitForm = () => setModal(!modal);
  return (
    <>
      <div className='submitBtn'>
        <Button color="success" onClick={toggleSubmitForm}>Submit Run</Button>
      </div>
      <Modal isOpen={modal} toggle={toggleSubmitForm}>
        <ModalHeader toggle={toggleSubmitForm} className='modalHead'>Submit Run</ModalHeader>
        <ModalBody className='modalBody'>
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
                <Input id='seconds' type='number' min={0} max={59} name='seconds' required />
                <Label htmlFor="seconds">&nbsp; s &nbsp;</Label>
                <Input id='milliseconds' type='number' name="milliseconds" min={0} max={999} required />
                <Label htmlFor="milliseconds"> &nbsp; ms &nbsp;</Label>
              </InputGroup>
            </div>

            {/* Run category */}
            <div id='runCategory' className='labeled-select'>
              <Label htmlFor='category'>Category: &nbsp; </Label>
              <select id='category' type='select' name='category' placeholder='Any% RSG'>
                <option value="Any% RSG">Any% RSG</option>
                <option value="Any% SSG">Any% SSG</option>
                <option value="AA RSG">AA RSG</option>
                <option value="AA SSG">AA SSG</option>
              </select>
            </div>

            {/* Game version */}
            <div className='labeled-select' id='gameVersion'>
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
            <div id='gameDifficulty' className='labeled-select'>
              <Label htmlFor='difficulty'>Difficulty: &nbsp; </Label>
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

  // If there are no runs, displays a message to the user saying that
  if (runs.length === 0) {
    return (
      <div className='runList'>
        <h3 className='emptyLb'>No Submissions Yet!</h3>
      </div>
    );
  }

  // Displays each run and its data in a table
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
      </tr>
    );
  });

  return (
    <div className='runList'>
      <Table color='success' className='has-text-centered resultsTable'>
        <thead>
          <tr>
            <th>Place</th>
            <th>Runner</th>
            <th>Time</th>
            <th>Category</th>
            <th>Version</th>
            <th>Difficulty</th>
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

  // Send a request for the total # of users
  useEffect(() => {
    const getNumUsers = async () => {
      const response = await fetch('/getNumUsers');
      const data = await response.json();
      setNumUsers(data.numUsers);
    };
    getNumUsers();
  }, [props.reloadStats]);

  // Send a request for the total # of submissions
  useEffect(() => {
    const getNumSubmissions = async () => {
      const response = await fetch('/getNumSubmissions');
      const data = await response.json();
      setNumSubmissions(data.numSubmissions);
    }
    getNumSubmissions();
  }, [props.reloadStats]);

  return (
    <div id='gameStats'>
      <h3>Game Stats</h3>
      <div id='statNode'>
        <table className='stats'>
          <tr className='numUsers'><th>Users</th><td>{numUsers}</td></tr>
          <tr className='numSubmissions'><th>Submissions</th><td>{numSubmissions}</td></tr>
        </table>
      </div>
    </div>
  );
};

const RecentRuns = (props) => {
  const [recentRuns, setRecentRuns] = useState(props.recentRuns);

  // Sends a request to the server for the information about the most recently submitted run
  useEffect(() => {
    const loadRunsFromServer = async () => {
      const response = await fetch('/getRecentRuns');
      const data = await response.json();
      setRecentRuns(data.recentRuns);
    };
    loadRunsFromServer();
  }, [props.reloadRuns]);

  // Displays the info about the run in a table form for ease of readability
  const runNode = recentRuns.map((run, i) => {
    time = `${run.timeHrs}h ${run.timeMins}m ${run.timeSecs}s ${run.timeMs}ms`;
    return (
      <div key={i} className={run} id='runNode'>
        <table className='runData'>
          <tr className='runner'><th>User</th><td>{run.user}</td></tr>
          <tr className='time'><th>Time</th><td>{time}</td></tr>
          <tr className='category'><th>Category</th><td>{run.category}</td></tr>
          <tr className='version'><th>Version</th><td>{run.version}</td></tr>
          <tr className='difficulty'><th>Difficulty</th><td>{run.difficulty}</td></tr>
        </table>
      </div>
    );
  });

  return (
    <div className='recentRun margin-sides has-text-centered is-half-width has-text-black margin-top'>
      <h3>Recent Run</h3>
      {runNode}
    </div>
  )
};

// Displays an ad on the page (as well as the premium toggle)
const Advertisement = () => {

  // List containing the file path to each image that can appear as a placeholder ad
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

  // Changes the image that is displayed every 15 seconds (15000 milliseconds)
  useEffect(() => {
    const delay = setInterval(() => {
      setCurrImg(images[_.random(images.length - 1)]);
    }, 15000);

    return () => clearInterval(delay);
  }, []);

  // Displays a checkbox that controls whether the user has premium mode or not
  // Displays a banner image (ie: an ad) if the user does not have premium (or nothing if they do)
  return (
    <Container className='container is-centered'>
      <div className='premiumMode'>
        <label htmlFor='premium'>Premium? </label>
        <input type="checkbox" name="premium" id="toggle-premium" className='checkbox' onChange={toggleIsPremium} />
      </div>
      <div className='img-container'>
        {
          isPremium ?
            <></> :
            <img className='image' src={currImg} alt="imag" />
        }
      </div>
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
        <Advertisement />
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
      <div id='stats'>
        <GameStats reloadStats={reloadStats} />
      </div>
      <div id='recentRuns'>
        <RecentRuns recentRuns={[]} reloadRecentRuns={reloadRecentRuns} />
      </div>
    </div>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render(<App />)
};
window.onload = init;
