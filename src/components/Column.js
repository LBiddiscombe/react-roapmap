import React from 'react'
import styled from 'styled-components'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Task from './Task'

const InnerList = React.memo(props => {
  return props.tasks.map((task, index) => (
    <Task
      key={task.id}
      task={task}
      index={index}
      columnIndex={props.columnIndex}
    />
  ))
})

function Column(props) {
  return (
    <Draggable draggableId={props.column.id} index={props.index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
        >
          <Droppable droppableId={props.column.id} type='task'>
            {(provided, snapshot) => (
              <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                <InnerList tasks={props.tasks} columnIndex={props.index} />
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  )
}

const Container = styled.div`
  margin: 8px;
  border-radius: 2px;
  background-color: var(--main-bg);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: ${props =>
    props.isDragging ? '2px solid #38394e30' : '2px solid transparent'};
`
const TaskList = styled.div`
  padding: 8px;
  transition: border 0.4s ease;
  border: ${props =>
    props.isDraggingOver ? '2px solid #38394e30' : '2px solid transparent'};
  flex-grow: 1;
  min-height: 100px;
`
export default Column
