import React, { useState, useEffect, Fragment } from 'react'
import { useFirebaseConnect, useFirestoreConnect } from 'react-redux-firebase'
import { useSelector, connect } from 'react-redux';
import { compose } from 'redux';
import 'materialize-css';
import { TextInput, Modal, Button } from 'react-materialize';
import { setLogLevel } from 'firebase';
import { updateSquare } from '../store/actions/action';
import {v1 as uuid} from 'uuid';

function Home(props) {
    const {updateSquare} = props
    useFirestoreConnect([{
        collection: 'squares',
        doc: 'data'
    }])
    useFirestoreConnect([{
        collection: 'config',
    }])
    
    const collection = useSelector(state=>state.firestore.ordered.squares);
    const configCol = useSelector(state=>state.firestore.ordered.config);
    const [squares, setSquares] = useState([])
    useEffect(()=>{
        if(!collection || collection.length == 0) return;
        setSquares(collection[0].squares);
    },[collection])
    const [value,setValue] = useState('');
    const [squareid,setSquareid] = useState();
    const [modalStateOpen , setModalStateOpen] = useState(false);
    const [valueLog, setValueLog] = useState({data:'Enter 4 digits', type:'valid'});

    const [madeSelection, setMadeSelection] = useState(false);
    const [errModalStateOpen , setErrModalStateOpen] = useState(false);
    
    const [teamA, setTeamA] = useState('');
    const [teamB, setTeamB] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');
    useEffect(()=>{
        validateValue();
    },[value])
    useEffect(()=>{
        if(!configCol || configCol.length == 0)return;
        if(localStorage.getItem('configuid') == configCol[0].uid) setMadeSelection(true);
        else  setMadeSelection(false);
        // console.log('configCol',configCol);
        setTeamA(configCol[0].teamA ?? '');
        setTeamB(configCol[0].teamB ?? '');
        setDate(configCol[0].date ?? '');
        setTime(configCol[0].time ?? '');
        setMessage(configCol[0].message ?? '');
    },[configCol])
    const validateValue = ()=>{
        // console.log('isNaN(value)',isNaN(value));
        if(value == '' ) {setValueLog({data:'Enter 4 digits', type:'invalid'}); return false;}
        if(isNaN(value)) {setValueLog({data:'Enter 4 digits (nothing accept numbers is allowed)', type:'invalid'}); return false;}
        if(value.toString().length < 4 ) {setValueLog({data:'Enter 4 digits', type:'invalid'}); return false;}
        if((value).toString().length > 4) {setValueLog({data:'Maximum length of 4 is allowed', type:'invalid'}); return false;}
        // console.log(squares.map(square=> square.val).includes(value), squares.map(square=> square.val), value );
        if(squares.map(square=> square.val).includes(parseInt(value))) {setValueLog({data:'this value has already been set', type:'invalid'}); return false;}
        setValueLog({data:'You can submit this', type:'valid'}); return true;
    }
    const submitSquareValue = ()=>{
        console.log('submitSquare value',value, squareid);
        // console.log('validateValue', validateValue());
        if(! validateValue()) return;
        if(squareid === '') return;
        console.log('passed check');
        var data = new Array(...squares);
        // console.log(data,data[squareid]);
        data[squareid] = {val: parseInt(value)};
        updateSquare({
            data: data
        })
        localStorage.setItem('configuid',configCol[0].uid);
        setMadeSelection(true);
    }

    return (
        <div className="Home">
            <div className="container">
            <div className="flex-container">
                <div className="image-container">
                    <img src="https://www.jgexchange.com/market/assets/img/fairlay-logo.png" />
                </div>
                <div className="teams-container">
                    <div 
                        style={{'marginBottom':'5px'}}
                        className="row">
                        <div className="col s5">
                            <h5 className="heavy_text white-text right-align">{teamA}</h5>
                        </div>
                        <div className="col s2">
                            <h5 className="center-align orange-text regular_text">
                                VS
                            </h5>
                        </div>
                        <div className="col s5">
                            <h5 className="heavy_text white-text left-align">{teamB}</h5>
                        </div>
                        <div className="col s12">
                            <p className="center-align regular_text">
                                {date} -{time}
                            </p>
                            <p className="center-align regular_text">
                                {message}
                                <br/>  You must tweet me your 4 digit number <a target="_blank" href="https://twitter.com/Spotonparts" className="neon-text">@spotonparts</a>
                            </p>
                            <p className="center-align heavy_text neon-text">
                                <a className="neon-text" target="_blank" href="https://jgexchange.com/bet.html/"> Bet on this game at the best odds on the fairlay app </a>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="grid-box">
                {squares && squares.map((square,index)=>(
                    <div key={uuid()} className="box" onClick={()=>{ 
                        if(madeSelection == false){ setSquareid(index); setModalStateOpen(true); }
                        else{ setErrModalStateOpen(true); }
                        
                        }} >
                        <div className={(square.val)?("box-content active"):("box-content")}>
                            <p className="index">{Math.floor(index/10)}-{index%10}</p>
                            <p className="val">{square?.val ?? ''}</p>
                        </div>
                    </div>
                ))}
                </div>
                
                <Modal
                    actions={[
                      <Button flat onClick={()=>{setModalStateOpen(false)}} modal="close" node="button" waves="red">Cancel</Button> ,
                      (squareid != null && squares.find((each,index)=>index == squareid).val )?(null):(
                        <Button flat onClick={()=>{setModalStateOpen(false); submitSquareValue()}} modal="close" node="button" waves="green">Set</Button>
                      )
                    ]}
                    bottomSheet={false}
                    fixedFooter={false}
                    header={`Set Square:${Math.floor(squareid/10)}-${squareid%10}`}
                    id={`Modal-sq`}
                    open={modalStateOpen}
                    options={{
                      dismissible: true,
                      endingTop: '10%',
                      inDuration: 250,
                      onCloseEnd: null,
                      onCloseStart:()=>{ setModalStateOpen(false)},
                      onOpenEnd: null,
                      onOpenStart: null,
                      opacity: 0.5,
                      outDuration: 250,
                      preventScrolling: true,
                      startingTop: '4%'
                    }}
                  >
                      {(squareid != null && squares.find((each,index)=>index == squareid).val )?(
                          <Fragment>
                              <p className="flow-text center red-text">
                                  This square is already set
                              </p>
                          </Fragment>
                      ):(
                        <Fragment>
                            <TextInput 
                            className= "square-input"
                            onChange={(e)=>{setValue(e.target.value)}}
                            value={value} />
                            <p className={(valueLog.type == 'invalid')?('red-text'):('green-text')}>{valueLog.data}</p>
                        </Fragment>
                      )}
                  </Modal>
                  <Modal
                    actions={[
                      <Button flat onClick={()=>{setErrModalStateOpen(false)}} modal="close" node="button" waves="red">Close</Button> ,
                    ]}
                    bottomSheet={false}
                    fixedFooter={false}
                    header={`Not Allowed`}
                    id={`ErrorModal`}
                    open={errModalStateOpen}
                    options={{
                      dismissible: true,
                      endingTop: '10%',
                      inDuration: 250,
                      onCloseEnd: null,
                      onCloseStart:()=>{ setErrModalStateOpen(false)},
                      onOpenEnd: null,
                      onOpenStart: null,
                      opacity: 0.5,
                      outDuration: 250,
                      preventScrolling: true,
                      startingTop: '4%'
                    }}
                  >
                      <p className="center flow-text red-text">
                          You have already made a selection in this session 
                      </p>
                  </Modal>
            </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state)=>{
    // console.log(state);
    return {

    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
        updateSquare: (update)=>{dispatch(updateSquare(update))}
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(Home)
