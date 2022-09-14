import React, { useEffect, useState } from 'react'
import { db } from './firestore'
import { v4 as uuidv4 } from 'uuid'
import { doc, setDoc, onSnapshot } from '@firebase/firestore'
import { Root, Container, ChatBubble, PlayerSection } from './styles'

type User = {
	id: string;
	name: string;
}

type Message = {
	user: User;
	timestamp: number;
	message: string;
}
interface ChatSectionProps {
  	players: Array<User>;
}


const pushToFirebase = async (user: string, text: string): Promise<void> => {
  	// we push to the database
  	const now = Date.now()

	// the user object will be:
	// user: {
	// 	[randomUuid]: {
	// 		messages: {
	// 			someTimeStamp: 'someMessage'
	// 			someOtherTimeStamp: 'someOtherMessage'
	// 		}
	// 	}
	// }

	const userRef = doc(db, `users/${user}`)
	setDoc(
		userRef,
		{
			messages: { [now]: text, },
		},
		{ merge: true, }
	)
}

const Player = ({ id, }: { id: string }) => {
	// a controlled form where on submit we send some data to firebase
	const [text, setText,] = useState('')

	return (
		<PlayerSection>
			<h3>Your message:</h3>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					setText('')
					pushToFirebase(id, text)
				}}
			>
				<input
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
			</form>
		</PlayerSection>
	)
}

const Chat = (props: ChatSectionProps): JSX.Element => {
	// TODO: Implement snapshot listeners on player 1 and player2. Display a chat of their messages.
	// https://firebase.google.com/docs/firestore/query-data/listen for snapshot documentation.
	// i have disabled all security, so you should not worry about that :)

	const [messageList, setMessageList,] = useState<Array<Message>>([])

	useEffect(() => {
		props?.players?.map((user: User) => {
			const unsubscribe = onSnapshot(
				doc(db, `users/${user.id}`),
				(document) => {
					setMessageList((message) => {
						const data = document?.data()
						const messageData = data?.messages
						if (data) {
							const newMessages = Object.keys(messageData).map(
								(timestamp) => {
									return {
										user,
										timestamp: Number(timestamp),
										message: messageData[timestamp],
									}
								}
							)
							return [...message, newMessages[newMessages.length -1],]
						} else {
							return message
						}
					})
				}, (error) => {
					<div>
						{error?.message}
					</div>
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
					<div className={`bubble ${userName === 'Joachim' ? 'blue' : 'orange'}`}>
						<ul key={index}>
							<div className="chat-header">
								<h4>
									{userName} at{' '}
									{new Date(Number(message?.timestamp)).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', })}
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

const App = (): JSX.Element => {
	// we generate a random uid for each player. We use this as their database id.
	// note: this means you cannot retrieve chats on page reload!

	const [idPlayerOne,] = useState(uuidv4())
	const [idPlayerTwo,] = useState(uuidv4())

	return (
		<Root>
			<Container>
				<Player id={idPlayerOne} />
			</Container>
			<Container>
				<Chat
					players={[
						{ id: idPlayerOne, name: 'Joachim', },
						{ id: idPlayerTwo, name: 'Nelly', },
					]}
				/>
			</Container>
			<Container>
				<Player id={idPlayerTwo} />
			</Container>
		</Root>
	)
}

export default App
