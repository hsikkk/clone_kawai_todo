import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  AsyncStorage,
} from "react-native";
import {AppLoading} from "expo";
import Todo from "./Todo";
import uuidv1 from "uuid/v1";

const {height, width} = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: "",
    loadedToDos: false,
    toDos: {},
  };

  componentDidMount = () => {
    this._loadToDos();
  };
  render() {
    const {newToDo, loadedToDos, toDos} = this.state;
    if (!loadedToDos) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Kawai To Do</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={"New To Do"}
            value={newToDo}
            onChangeText={this._controllNewTodo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
          />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos)
              .reverse()
              .map((toDo) => (
                <Todo
                  key={toDo.id}
                  {...toDo}
                  deleteToDo={this._deleteToDo}
                  toggleToDo={this._toggleToDo}
                  editToDo={this._editToDo}
                />
              ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  _controllNewTodo = (text) => {
    this.setState({
      newToDo: text,
    });
  };

  _addToDo = () => {
    const {newToDo} = this.state;
    if (newToDo !== "") {
      this.setState((prevState) => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now(),
          },
        };
        const newState = {
          ...prevState,
          newToDo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject,
          },
        };
        this._saveToDos(newState.toDos);
        return {...newState};
      });
    }
  };

  _deleteToDo = (id) => {
    this.setState((prevState) => {
      const toDos = prevState.toDos;
      delete toDos[id];

      const newState = {
        ...prevState,
        ...toDos,
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  };

  _toggleToDo = (id) => {
    this.setState((prevState) => {
      const newState = {
        ...prevState,

        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: !prevState.toDos[id].isCompleted,
          },
        },
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  };

  _editToDo = (id, changeToDo) => {
    this.setState((prevState) => {
      const newState = {
        ...prevState,

        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: changeToDo,
          },
        },
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  };

  _saveToDos = (newToDos) => {
    const saveToDos = AsyncStorage.setItem("ToDos", JSON.stringify(newToDos));
  };

  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("ToDos");
      const parsedToDos = JSON.parse(toDos);
      this.setState({
        loadedToDos: true,
        toDos: parsedToDos,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F23657",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 60,
    marginBottom: 50,
    fontWeight: "200",
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50,50,50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0,
        },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25,
  },
  toDos: {
    alignItems: "center",
  },
});
