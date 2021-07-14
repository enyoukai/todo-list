// import { render } from '@testing-library/react'; // wtf is this
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';

import '@fontsource/roboto';

import {v4 as uuid} from 'uuid';

const ROUTE = "https://localhost:5001/api/"

function toPayload(task) {
    return {"content": task.content, "id": task.key};
}

function toTask(payload) {    
    return {content: payload.content, key: payload.id};
}

class Task extends React.Component {
    delete() {
        this.props.delete(this.props.id);
    }
    render() {
        return (
            <li>
                <Card>
                    <CardContent>
                        <Typography>
                            {this.props.content}
                        </Typography>
                    </CardContent>
                </Card>
                <Button onClick={this.delete.bind(this)}>Delete</Button>
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

        fetch(ROUTE + "TodoItems").then(response => response.json()).then(data => this.setState({tasks: data.map(payload => toTask(payload))}));
    }
    addTask(content) {
        var task = 
        {
            content: content,
            key: uuid()
        };

        var payload = toPayload(task);
 
        fetch(ROUTE + "TodoItems", {method: "POST", headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify(payload)})

        this.setState({
            tasks: this.state.tasks.concat([task])
        });
        
    }

    deleteTask(key) {
        var tasks = this.state.tasks.filter(task => task.key !== key);
        this.setState({tasks: tasks});
        fetch(ROUTE + "TodoItems/" + key, {method: "DELETE", headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}})
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