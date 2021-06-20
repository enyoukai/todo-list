// import { render } from '@testing-library/react'; // wtf is this
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import { Button } from '@material-ui/core';

import {v4 as uuid} from 'uuid';

class Task extends React.Component {
    delete() {
        this.props.delete(this.props.id);
    }
    render() {
        return (
            <li>
                <Button variant="contained" color="primary" onClick={this.delete.bind(this)}>{this.props.content}</Button>
            </li>
        )
    }
}

function Tasks(props) {
    return props.tasks.map((task, index) => {
        return <Task delete={props.delete} id={task.key} key={task.key} content={task.content}/>
    })

}

class Interface extends React.Component {
    onClick() {
        this.props.onClick(this.value);
    }
    render() {
        return (
            <div>
                <input type="text" onChange={(e) => this.value = e.target.value}/>
                <button onClick={this.onClick.bind(this)}>Make New Task</button>
            </div>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
        }
    }
    addTask(content) {
        var task = [
        {
            content: content,
            key: uuid()
        }];
        this.setState({
            tasks: this.state.tasks.concat(task)
        });
        
    }

    deleteTask(key) {
        var tasks = this.state.tasks.filter(task => task.key !== key);
        this.setState({tasks: tasks});
    }
    
    render() {
        return (
            <div className="app">
                <p>To-Do List</p>
                <div className="tasks">
                    <ol>
                        <Tasks tasks={this.state.tasks} delete={this.deleteTask.bind(this)}/>
                    </ol>
                </div>
                <div className="interface">
                    <Interface onClick={this.addTask.bind(this)}/>
                </div>
            </div>
        )
    }
}
ReactDOM.render(
    <App/>,
    document.getElementById('root')
);