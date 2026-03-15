import { defHttp } from '@/utils/http/axios'

const API_CHAT = '/system/assistant/chat'

async function sendMessageToAI(message: string): Promise<string> {
  try {
    const response = await defHttp.post({
      url: API_CHAT,
      params: { message },
      headers: {
        'tenant-id': '1',
        'accept': '*/*',
      },
      data: { 'message': message },
    }, {
      errorMessageMode: 'modal',
    })

    return response
  }
  catch (error: any) {
    console.error('发送消息到AI失败:', error)
    throw error
  }
}

export default sendMessageToAI
