import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList, AsyncStorage,
  Button, TextInput, Linking } from "react-native";

export default class TodoList extends Component {
  state = {
    tasks: [],
    text: ""
  };

  changeTextHandler = text => {
    this.setState({ text: text });
  };

  addTask = () => {
    let notEmpty = this.state.text.trim().length > 0;

    if (notEmpty) {
      this.setState(
          prevState => {
            let { tasks, text } = prevState;
            return {
              tasks: tasks.concat({ key: tasks.length, text: text }),
              text: ""
            };
          },
          () => Tasks.save(this.state.tasks)
      );
    }
  };

  deleteTask = i => {
    this.setState(
        prevState => {
          let tasks = prevState.tasks.slice();

          tasks.splice(i, 1);

          return { tasks: tasks };
        },
        () => Tasks.save(this.state.tasks)
    );
  };

  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.header}>To Do List</Text>
          <TextInput
              style={styles.textInput}
              onChangeText={this.changeTextHandler}
              onSubmitEditing={this.addTask}
              value={this.state.text}
              placeholder="Add Tasks"
              returnKeyType="done"
              returnKeyLabel="done"
          />
          <FlatList
              style={styles.list}
              data={this.state.tasks}
              renderItem={({ item, index }) =>
                  <View>
                    <View style={styles.listItemCont}>
                      <Text style={styles.listItem}>
                        {item.text}
                      </Text>
                      <Button title="X" onPress={() => this.deleteTask(index)} />
                    </View>
                    <View style={styles.hr} />
                  </View>}
          />
          <Text style={styles.caption} onPress={() =>
              Linking.openURL('https://codeburst.io/todo-app-with-react-native-f889e97e398e')}>
            Built from Ahmed Mahmoud's Tutorial
          </Text>
        </View>
    );
  }
}

let Tasks = {
  convertToArrayOfObject(tasks, callback) {
    return callback(
        tasks ? tasks.split("||").map((task, i) => ({ key: i, text: task })) : []
    );
  },
  convertToStringWithSeparators(tasks) {
    return tasks.map(task => task.text).join("||");
  },
  all(callback) {
    return AsyncStorage.getItem("TASKS", (err, tasks) =>
        this.convertToArrayOfObject(tasks, callback)
    );
  },
  save(tasks) {
    AsyncStorage.setItem("TASKS", this.convertToStringWithSeparators(tasks));
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightskyblue",
    padding: 20,
    paddingTop: 20,
  },
  header: {
    marginTop: 15,
    padding: 20,
    fontSize: 40,
    fontFamily: 'AmericanTypewriter-Bold',
    color: 'midnightblue',
  },
  list: {
    width: "90%"
  },
  listItem: {
    paddingTop: 20,
    paddingBottom: 5,
    fontSize: 25,
    fontFamily: 'AmericanTypewriter',
    color: 'midnightblue',
  },
  hr: {
    height: 1,
    backgroundColor: "deepskyblue",
  },
  listItemCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInput: {
    marginTop: 5,
    height: 50,
    fontSize: 20,
    fontFamily: 'AmericanTypewriter',
    color: 'midnightblue',
    padding: 10,
    width: "90%",
    borderColor: 'deepskyblue',
    borderWidth: 5,
    borderRadius: 25
  },
  caption: {
    fontSize: 12,
    fontStyle: 'italic',
    color: 'midnightblue',
    padding: 10
  }
});
