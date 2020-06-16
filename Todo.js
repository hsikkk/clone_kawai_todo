import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";

const {width, height} = Dimensions.get("window");

export default class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isEditing: false, toDoValue: props.text};
  }
  static PropTypes = {
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    deleteToDo: PropTypes.func.isRequired,
    toggleToDo: PropTypes.func.isRequired,
    editToDo: PropTypes.func.isRequired,
    key: PropTypes.string.isRequired,
  };
  state = {
    isEditing: false,
    toDoValue: "",
  };
  render() {
    const {isEditing, toDoValue} = this.state;
    const {text, id, isCompleted, deleteToDo, toggleToDo} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <TouchableOpacity
            onPressOut={(event) => {
              event.stopPropagation();
              toggleToDo(id);
            }}>
            <View
              style={[
                styles.circle,
                isCompleted ? styles.completedCircle : styles.uncompletedCircle,
              ]}
            />
          </TouchableOpacity>
          {isEditing ? (
            <TextInput
              value={toDoValue}
              style={[
                styles.text,
                isCompleted ? styles.completedText : styles.uncompletedText,
              ]}
              multiline={true}
              onChangeText={this._controllInput}
              onBlur={this._finishEditing}
              returnKeyType={"done"}
            />
          ) : (
            <Text
              style={[
                styles.text,
                isCompleted ? styles.completedText : styles.uncompletedText,
              ]}>
              {text}
            </Text>
          )}
        </View>
        <View style={styles.column}>
          {isEditing ? (
            <View style={styles.actions}>
              <TouchableOpacity onPressOut={this._finishEditing}>
                <View style={styles.actionContainer}>
                  <Text style={styles.actionText}>✅</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actions}>
              <TouchableOpacity onPressOut={this._startEditing}>
                <View style={styles.actionContainer}>
                  <Text style={styles.actionText}>✏️</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPressOut={(event) => {
                  event.stopPropagation();
                  deleteToDo(id);
                }}>
                <View style={styles.actionContainer}>
                  <Text style={styles.actionText}>❌</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }

  _startEditing = (event) => {
    event.stopPropagation();
    const {toDoValue} = this.state;
    this.setState({
      isEditing: true,
      toDoValue: toDoValue,
    });
  };
  _finishEditing = (event) => {
    event.stopPropagation();
    const {toDoValue} = this.state;
    const {id, editToDo} = this.props;
    this.setState({
      isEditing: false,
    });
    editToDo(id, toDoValue);
  };
  _controllInput = (text) => {
    this.setState({toDoValue: text});
  };
}

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontWeight: "400",
    fontSize: 20,
    marginVertical: 20,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    marginRight: 20,
  },
  completedCircle: {
    borderColor: "#bbb",
  },
  uncompletedCircle: {
    borderColor: "#F23657",
  },
  completedText: {
    color: "#bbb",
    textDecorationLine: "line-through",
  },
  uncompletedText: {
    color: "#353839",
  },
  column: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actions: {
    flexDirection: "row",
  },
  actionText: {},
  actionContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
});
