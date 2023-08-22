import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function Header(props) {
  return <header>
    <h1><a href='/' onClick={
      (e) => {
        e.preventDefault();
        props.onChangeMode();
      }
    }>WEB</a></h1>
  </header>
}

function Article(props) {
  return <article>
    <h1>{props.title}</h1>
    <p>{props.body}</p>
  </article>
}

function Nav(props) {
  const lis = [];
  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(<li key={t.id}><a id={t.id} href={'/read/' + t.id} onClick={
      function (e) {
        e.preventDefault();
        props.onChangeMode(e.target.id);
      }
    }>{t.title}</a></li>);
  } //자동으로 생성한 태그의 경우 각각 다른 key값을 가져야함

  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

function Create(props) {
  return <article>
    <h1>CREATE</h1>
    <form onSubmit={(e) => {//submit했을때 실행 리로드됨
      e.preventDefault();
      const title = e.target.title.value; //e.타겟은 form태그
      const body = e.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type='text' name='title' placeholder='title'></input></p>
      <p><textarea name='body' placeholder='body'></textarea></p>
      <p><input type='submit' value='create'></input></p>
    </form>
  </article>
}

function Update(props) {
  const [updatedTitle, setUpdatedTitle] = useState(props.title);
  const [updatedBody, setUpdatedBody] = useState(props.body);

  return <article>
    <h1>Update</h1>
    <form onSubmit={(e) => {
      e.preventDefault();
      props.onUpdate(updatedTitle, updatedBody);
    }}>
      <p><input type='text' name='title' placeholder='title' value={updatedTitle} onChange={
        (e) => { //값을 입력할 때마다 호출
          setUpdatedTitle(e.target.value);
        }
      }></input></p>
      <p><textarea name='body' placeholder='body' value={updatedBody} onChange={
        (e) => { //값을 입력할 때마다 호출
          setUpdatedBody(e.target.value);
        }}></textarea></p>
      <input type='submit' value='update'></input>
    </form>

  </article>
}

function App() {
  const [mode, setMode] = useState('READ');
  const [id, setId] = useState(null);
  console.log(mode);
  let contextControl = null;

  const [nextNum, setNextNum] = useState(4);
  const [topics, setTopics] = useState([
    { id: 1, title: 'html', body: 'html is...' },
    { id: 2, title: 'css', body: 'css is...' },
    { id: 3, title: 'javascript', body: 'js is...' },
  ]);

  let content = null;
  if (mode === 'WELCOME') {
    content = <Header onChangeMode={() => {
      alert('Header');
    }}></Header>;
  }
  else if (mode === 'READ') {
    let mode_title, mode_body;
    for (let i = 0; i < topics.length; i++) {
      if (Number(id) == topics[i].id) {
        console.log(id, topics[i].id);
        mode_title = topics[i].title;
        mode_body = topics[i].body;
      }
    }
    console.log(mode_title, mode_body);
    content = <Article title={mode_title} body={mode_body}></Article>
    contextControl = <>
      <li><a href='/' onClick={(e) => {
        e.preventDefault();
        setMode('UPDATE');
      }
      }>Update</a></li>
      <li><a href='/' type='button' value='Delete' onClick={(e) => {
        e.preventDefault();
        const newTopics = [];
        for (let i = 0; i < topics.length; i++) {
          if (topics[i].id != id) {
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELCOME');
      }}>Delete</a></li>
    </>
  }
  else if (mode === 'CREATE') {
    content = <Create onCreate={(_title, _body) => {
      console.log(nextNum);
      const newTopic = { id: nextNum, title: _title, body: _body };
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextNum);
      setNextNum(nextNum + 1);
      console.log(nextNum);
    }}></Create>
  }
  else if (mode === 'UPDATE') {

    let updating_title, updating_body;
    for (let i = 0; i < topics.length; i++) {
      if (Number(id) == topics[i].id) {
        updating_title = topics[i].title;
        updating_body = topics[i].body;
        break;
      }
    }
    console.log(updating_title);
    content = <Update title={updating_title} body={updating_body} onUpdate={(updatedTitle, updatedBody) => {
      const newTopic = { id: id, title: updatedTitle, body: updatedBody };
      const newTopics = [...topics];
      for (let i = 0; i < topics.length; i++) {
        if (Number(id) == topics[i].id) {
          newTopics[i] = newTopic;
          console.log(newTopics[i]);
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }


  return (
    <div className="App">
      <Header onChangeMode={() => {
        alert('Header');
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onChangeMode={
        (_id) => {
          setId(_id);
          setMode('READ');
        }
      }></Nav>
      {content}

      <ul>
        <li><a href='/' onClick={(e) => {
          e.preventDefault();
          setMode('CREATE');
        }}>Create</a></li>
        {contextControl}
      </ul>

      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
