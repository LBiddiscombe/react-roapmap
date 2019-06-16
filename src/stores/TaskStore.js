import { observable, action, decorate } from 'mobx'
import initialData from '../initial-data'

class TaskStore {
  tasks = []
  modules = []
  columns = []
  taskLists = []
  addingNewTask = false

  task = id => this.tasks.find(task => task.id === id)
  module = id => this.modules.find(module => module.id === id)
  column = id => this.columns.find(column => column.id === id)
  taskList = (moduleId, columnId) =>
    this.taskLists.find(
      taskList =>
        taskList.moduleId === moduleId && taskList.columnId === columnId
    )

  addTask(moduleId, columnId, title) {
    // HACK: for now block adding multiple new tasks by checking for another blank title, better to hide the add button
    const blankTasks = this.tasks.findIndex(task => task.title === '')
    if (blankTasks > 0) return

    const id = `t${this.tasks.length}`
    this.tasks.push({
      id,
      title
    })

    const tl = this.taskList(moduleId, columnId)
    tl.taskIds.push(id)
  }

  updateTask(id, title) {
    this.task(id).title = title
    this.addingNewTask = false
  }

  deleteTask(id) {
    const tl = this.taskLists.find(taskList => taskList.taskIds.includes(id))
    console.log(tl)
  }

  moveTask(
    id,
    fromIndex,
    toIndex,
    [fromModuleId, fromColumnId],
    [toModuleId, toColumnId]
  ) {
    const fromTaskList = this.taskList(fromModuleId, fromColumnId)
    const toTaskList = this.taskList(toModuleId, toColumnId)

    fromTaskList.taskIds.splice(fromIndex, 1)
    toTaskList.taskIds.splice(toIndex, 0, id)
  }

  reorderTask(moduleId, columnId, taskId, from, to) {
    const tl = this.taskList(moduleId, columnId)
    tl.taskIds.splice(from, 1)
    tl.taskIds.splice(to, 0, taskId)
  }

  addModule(title) {
    this.modules.push({ id: `m${this.modules.length}`, title })
  }

  addColumn(title) {
    this.columns.push({ id: `c${this.columns.length}`, title })
  }

  reorderColumn(columnId, from, to) {
    const column = { ...this.column(columnId) }
    this.columns.splice(from, 1)
    this.columns.splice(to, 0, column)
  }

  addTaskList(moduleId, columnId) {
    if (!this.taskList(moduleId, columnId)) {
      this.taskLists.push({
        moduleId,
        columnId,
        taskIds: []
      })
    }
  }

  loadInitialData() {
    initialData.modules.forEach((module, moduleIndex) => {
      this.addModule(module.title)
    })

    initialData.columns.forEach((column, columnIndex) => {
      this.addColumn(column.title)
    })

    this.modules.forEach(module => {
      this.columns.forEach(column => {
        this.addTaskList(module.id, column.id)
      })
    })

    initialData.tasks.forEach(task => {
      const mct = initialData.moduleColumnTasks.find(mct =>
        mct.taskIds.includes(task.id)
      )
      this.addTask(mct.moduleId, mct.columnId, task.content)
    })
  }
}

decorate(TaskStore, {
  tasks: observable,
  modules: observable,
  columns: observable,
  taskLists: observable,
  addingNewTask: observable,
  addTask: action,
  moveTask: action,
  reorderTask: action,
  addModule: action,
  addColumn: action,
  addtaskList: action
})

export default TaskStore
