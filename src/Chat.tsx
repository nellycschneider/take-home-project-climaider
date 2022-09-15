/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import { db } from './firestore'
import { doc, onSnapshot } from '@firebase/firestore'
import { ChatBubble } from './styles'

import { User, Message, ChatSectionProps } from './types'


const Chat = (props: ChatSectionProps): JSX.Element => {
	// TODO: Implement snapshot listeners on player 1 and player2. Display a chat of their messages.
	// https://firebase.google.com/docs/firestore/query-data/listen for snapshot documentation.
	// i have disabled all security, so you should not worry about that :)

	const [messageList, setMessageList,] = useState<Array<Message>>([])

	useEffect(() => {
    props?.users?.map((user: User) => {
    	const unsubscribe = onSnapshot(
    		doc(db, `users/${user.id}`),
    		(document) => {                
    			setMessageList((message) => {
    				const data = document?.data()
    				const messageData = data?.messages
    				if (data) {
    					const newMessages = Object.keys(messageData).map((timestamp) => {
    						return {
    							user,
    							timestamp: Number(timestamp),
    							message: messageData[timestamp],
    						}
    					})
    					return [...message, newMessages[newMessages.length - 1],]
    				} else {
    					return message
    				}
    			})
    		}
    	)
    	return () => unsubscribe()
    })
	}, [])

	return (
		<ChatBubble>
			{messageList.map((message: Message, index: number) => {
				const userName = message?.user?.name
				const userMessage = message?.message

				return (
					<div
						className={`bubble ${userName === 'Joachim' ? 'blue' : 'orange'}`}
						key={index}
					>
						<ul key={index}>
							<div className="chat-header">
								<h4>
									{userName} at{' '}
									{new Date(Number(message?.timestamp)).toLocaleTimeString([], {
										hour: '2-digit',
										minute: '2-digit',
									})}
								</h4>
							</div>
							<p>{userMessage}</p>
						</ul>
					</div>
				)
			})}
		</ChatBubble>
	)
}

export default Chat