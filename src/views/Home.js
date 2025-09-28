import React, { useState, useEffect, Fragment } from "react";
import { useFirebaseConnect, useFirestoreConnect } from "react-redux-firebase";
import { useSelector, connect } from "react-redux";
import { compose } from "redux";
import "materialize-css";
import { TextInput, Modal, Button } from "react-materialize";
import { setLogLevel } from "firebase";
import { updateSquare } from "../store/actions/action";
import { v1 as uuid } from "uuid";

const logo = "https://cdn.dnaracing.run/imgs/dna_logo.png";

function Home(props) {
  const { updateSquare } = props;
  useFirestoreConnect([
    {
      collection: "squares",
      doc: "data",
    },
  ]);
  useFirestoreConnect([
    {
      collection: "config",
    },
  ]);

  const collection = useSelector((state) => state.firestore.ordered.squares);
  const configCol = useSelector((state) => state.firestore.ordered.config);
  const [squares, setSquares] = useState([]);
  useEffect(() => {
    if (!collection || collection.length == 0) return;
    setSquares(collection[0].squares);
  }, [collection]);
  const [value, setValue] = useState("");
  const [squareid, setSquareid] = useState();
  const [modalStateOpen, setModalStateOpen] = useState(false);
  const [valueLog, setValueLog] = useState({
    data: "Enter 5 digits",
    type: "valid",
  });

  const mx_sels = 3;
  const [madeSelection, setMadeSelection] = useState(0);
  const [errModalStateOpen, setErrModalStateOpen] = useState(false);
  const [errModalMessage, setErrModalMessage] = useState("");

  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    validateValue();
  }, [value]);
  useEffect(() => {
    if (!configCol || configCol.length == 0) return;
    if (localStorage.getItem("made_selections"))
      setMadeSelection(parseInt(localStorage.getItem("made_selections")));
    else setMadeSelection(0);
    // console.log('configCol',configCol);
    setTeamA(configCol[0].teamA ?? "");
    setTeamB(configCol[0].teamB ?? "");
    setDate(configCol[0].date ?? "");
    setTime(configCol[0].time ?? "");
    setMessage(configCol[0].message ?? "");
  }, [configCol]);
  const validateValue = () => {
    // console.log('isNaN(value)',isNaN(value));
    if (value == "") {
      setValueLog({ data: "Enter up to 5 digits", type: "invalid" });
      return false;
    }
    if (isNaN(value)) {
      setValueLog({
        data: "Enter digits (nothing except numbers is allowed)",
        type: "invalid",
      });
      return false;
    }
    if (value.toString().length <= 0) {
      setValueLog({ data: "Enter up to 5 digits", type: "invalid" });
      return false;
    }
    if (value.toString().length > 5) {
      setValueLog({ data: "Maximum length of 5 is allowed", type: "invalid" });
      return false;
    }
    // console.log(squares.map(square=> square.val).includes(value), squares.map(square=> square.val), value );
    if (squares.map((square) => square.val).includes(parseInt(value))) {
      setValueLog({ data: "this value has already been set", type: "invalid" });
      return false;
    }
    setValueLog({ data: "You can submit this", type: "valid" });
    return true;
  };
  const submitSquareValue = () => {
    console.log("submitSquare value", value, squareid);
    // console.log('validateValue', validateValue());
    if (!validateValue()) return;
    if (squareid === "") return;
    console.log("passed check");
    var data = new Array(...squares);
    // console.log(data,data[squareid]);
    data[squareid] = { val: parseInt(value) };
    updateSquare({
      data: data,
    });
    let n2 = madeSelection + 1;
    localStorage.setItem("made_selections", n2);
    setMadeSelection(n2);
  };

  return (
    <div className="Home">
      <div className="container">
        <div className="flex-container">
          <div className="image-container">
            <img src={logo} />
          </div>
          <div className="teams-container">
            <div style={{ marginBottom: "5px" }} className="row">
              <div className="col s5">
                <h5 className="heavy_text white-text right-align">{teamA}</h5>
              </div>
              <div className="col s2">
                <h5 className="center-align orange-text regular_text">VS</h5>
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
                  <br />
                  You
                  <span className="neon-text">{" MUST "}</span>
                  tweet using the black X post button
                  <a
                    href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                    class="twitter-share-button"
                    data-text="I just entered the @dnaracing FREE squares contest"
                    data-url="https://www.dnaracing.run/"
                    data-via="spotonparts"
                    data-hashtags="dnaracing"
                    data-lang="en"
                    data-show-count="false"
                  >
                    Tweet
                  </a>
                  <script
                    async
                    src="https://platform.twitter.com/widgets.js"
                    charset="utf-8"
                  ></script>
                </p>
              </div>
            </div>
          </div>
          <div className="grid-box">
            {squares &&
              squares.map((square, index) => (
                <div
                  key={uuid()}
                  className="box"
                  onClick={() => {
                    if (configCol[0] && configCol[0].isLocked) {
                      setErrModalStateOpen(true);
                      setErrModalMessage(
                        "Game has Stated. No more selections allowed",
                      );
                    } else {
                      if (madeSelection >= mx_sels) {
                        setErrModalStateOpen(true);
                        setErrModalMessage(
                          `You have already made ${mx_sels} selection`,
                        );
                      } else {
                        setSquareid(index);
                        setModalStateOpen(true);
                      }
                    }
                  }}
                >
                  <div
                    className={
                      square.val ? "box-content active" : "box-content"
                    }
                  >
                    <p className="index">
                      {Math.floor(index / 10)}-{index % 10}
                    </p>
                    <p className="val">{square?.val ?? ""}</p>
                  </div>
                </div>
              ))}
          </div>

          <Modal
            actions={[
              <Button
                flat
                onClick={() => {
                  setModalStateOpen(false);
                }}
                modal="close"
                node="button"
                waves="red"
              >
                Cancel
              </Button>,
              squareid != null &&
              squares.find((each, index) => index == squareid).val ? null : (
                <Button
                  flat
                  onClick={() => {
                    setModalStateOpen(false);
                    submitSquareValue();
                  }}
                  modal="close"
                  node="button"
                  waves="green"
                >
                  Set
                </Button>
              ),
            ]}
            bottomSheet={false}
            fixedFooter={false}
            header={`Set Square:${Math.floor(squareid / 10)}-${squareid % 10}`}
            id={`Modal-sq`}
            open={modalStateOpen}
            options={{
              dismissible: true,
              endingTop: "10%",
              inDuration: 250,
              onCloseEnd: null,
              onCloseStart: () => {
                setModalStateOpen(false);
              },
              onOpenEnd: null,
              onOpenStart: null,
              opacity: 0.5,
              outDuration: 250,
              preventScrolling: true,
              startingTop: "4%",
            }}
          >
            {squareid != null &&
            squares.find((each, index) => index == squareid).val ? (
              <Fragment>
                <p className="flow-text center red-text">
                  This square is already set
                </p>
              </Fragment>
            ) : (
              <Fragment>
                <TextInput
                  className="square-input"
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                  value={value}
                />
                <p
                  className={
                    valueLog.type == "invalid" ? "red-text" : "green-text"
                  }
                >
                  {valueLog.data}
                </p>
              </Fragment>
            )}
          </Modal>
          <Modal
            actions={[
              <Button
                flat
                onClick={() => {
                  setErrModalStateOpen(false);
                }}
                modal="close"
                node="button"
                waves="red"
              >
                Close
              </Button>,
            ]}
            bottomSheet={false}
            fixedFooter={false}
            header={`Not Allowed`}
            id={`ErrorModal`}
            open={errModalStateOpen}
            options={{
              dismissible: true,
              endingTop: "10%",
              inDuration: 250,
              onCloseEnd: null,
              onCloseStart: () => {
                setErrModalStateOpen(false);
              },
              onOpenEnd: null,
              onOpenStart: null,
              opacity: 0.5,
              outDuration: 250,
              preventScrolling: true,
              startingTop: "4%",
            }}
          >
            <p className="center flow-text red-text">{errModalMessage}</p>
          </Modal>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  // console.log(state);
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSquare: (update) => {
      dispatch(updateSquare(update));
    },
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Home);
