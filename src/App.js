import React, { useRef, useState } from 'react';
import './App.css';
// v9 compat packages are API compatible with v8 code
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';




firebase.initializeApp({
  apiKey: "AIzaSyAQfx_82hGztfw_jiO-v9fsloFeQBoaFPA",
  authDomain: "chat-app-7a928.firebaseapp.com",
  projectId: "chat-app-7a928",
  storageBucket: "chat-app-7a928.appspot.com",
  messagingSenderId: "196249821309",
  appId: "1:196249821309:web:58e25f21f287ed9913d114",
  measurementId: "G-VKX0M267YC"
}) 

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}

function SignIn () {

  const SignInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <button onClick={SignInWithGoogle}>Sign In With Google</button>
  )
}

function ChatRoom () {
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) =>{
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
  }

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      </div>

      <form>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </>
  )
}

function SignOut () {
  return auth.currentUser && (
    <button onClick={() => auth.SignOut()}>Sign Out</button>
  ) 
}

function ChatMessage (props) {
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    < div className={'message ${messageClass'}>
      <img src={photoURL} alt = 'User'/>
      <p>{text}</p>
    </div>
  )
}

export default App;
