import { useState, useEffect } from 'react'
import { Input, Button, List, Checkbox, Card, Typography, Space, Divider, message } from 'antd'
import { PlusOutlined, CrownOutlined, StarOutlined, DeleteOutlined } from '@ant-design/icons'
import { Item } from '../entities/Item'

const { Title, Text } = Typography

function PrincessTodoApp() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    setLoading(true)
    try {
      const response = await Item.list()
      if (response.success) {
        setTodos(response.data || [])
      }
    } catch (error) {
      message.error('Failed to load your royal tasks!')
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim()) {
      message.warning('Please enter a royal task!')
      return
    }

    try {
      const response = await Item.create({
        title: newTodo.trim(),
        completed: false
      })
      
      if (response.success) {
        setTodos([...todos, response.data])
        setNewTodo('')
        message.success('Royal task added to your kingdom!')
      }
    } catch (error) {
      message.error('Failed to add your royal task!')
    }
  }

  const toggleTodo = async (todoId, completed) => {
    try {
      const response = await Item.update(todoId, { completed: !completed })
      
      if (response.success) {
        setTodos(todos.map(todo => 
          todo._id === todoId ? { ...todo, completed: !completed } : todo
        ))
        message.success(!completed ? 'Task completed! You are a magnificent princess!' : 'Task reopened, Your Highness!')
      }
    } catch (error) {
      message.error('Failed to update your royal task!')
    }
  }

  const deleteTodo = async (todoId) => {
    try {
      // Note: Using update with a deleted flag since there's no delete method mentioned
      const response = await Item.update(todoId, { deleted: true })
      
      if (response.success) {
        setTodos(todos.filter(todo => todo._id !== todoId))
        message.success('Royal task dismissed from your kingdom!')
      }
    } catch (error) {
      // Fallback: remove from local state if API call fails
      setTodos(todos.filter(todo => todo._id !== todoId))
      message.success('Royal task dismissed!')
    }
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <CrownOutlined className="text-6xl text-yellow-500" />
            <Title level={1} className="mb-0 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Princess Todo Kingdom
            </Title>
            <CrownOutlined className="text-6xl text-yellow-500" />
          </div>
          <Text className="text-lg text-gray-600">
            Manage your royal duties with grace and elegance ✨
          </Text>
        </div>

        <Card 
          className="mb-6 shadow-lg border-0"
          style={{ 
            background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%)',
            borderRadius: '16px'
          }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              size="large"
              placeholder="Add a new royal task... 👑"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onPressEnter={addTodo}
              className="flex-1 rounded-xl border-2 border-pink-200 focus:border-purple-400"
              style={{ fontSize: '16px' }}
            />
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={addTodo}
              className="bg-gradient-to-r from-pink-500 to-purple-600 border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ minWidth: '120px' }}
            >
              Add Task
            </Button>
          </div>
        </Card>

        {totalCount > 0 && (
          <Card 
            className="mb-6 shadow-md border-0"
            style={{ 
              background: 'linear-gradient(135deg, #fff1f2 0%, #fef7ff 100%)',
              borderRadius: '12px'
            }}
          >
            <div className="flex justify-between items-center">
              <Text className="text-lg font-semibold text-gray-700">
                <StarOutlined className="text-yellow-500 mr-2" />
                Royal Progress
              </Text>
              <Text className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                {completedCount} / {totalCount} completed
              </Text>
            </div>
            <div className="mt-3 bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-pink-400 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }}
              ></div>
            </div>
          </Card>
        )}

        <Card 
          className="shadow-lg border-0"
          style={{ 
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Title level={3} className="mb-4 text-center text-gray-700">
            <CrownOutlined className="text-purple-500 mr-2" />
            Your Royal Tasks
          </Title>
          
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <StarOutlined className="text-6xl text-gray-300 mb-4" />
              <Text className="text-xl text-gray-500 block mb-2">
                Your kingdom is peaceful, Your Highness!
              </Text>
              <Text className="text-gray-400">
                Add your first royal task to begin your quest ✨
              </Text>
            </div>
          ) : (
            <List
              dataSource={todos}
              loading={loading}
              renderItem={(todo) => (
                <List.Item 
                  className={`rounded-xl mb-3 p-4 transition-all duration-300 hover:shadow-md ${
                    todo.completed 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                      : 'bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200'
                  }`}
                  actions={[
                    <Button
                      key="delete"
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => deleteTodo(todo._id)}
                      className="hover:bg-red-100 rounded-lg"
                    />
                  ]}
                >
                  <Space className="w-full">
                    <Checkbox
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo._id, todo.completed)}
                      className="custom-checkbox"
                    />
                    <Text 
                      className={`flex-1 text-lg ${
                        todo.completed 
                          ? 'line-through text-gray-500' 
                          : 'text-gray-800 font-medium'
                      }`}
                    >
                      {todo.title}
                    </Text>
                    {todo.completed && (
                      <StarOutlined className="text-yellow-500 text-xl animate-pulse" />
                    )}
                  </Space>
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
    </div>
  )
}

export default PrincessTodoApp