import React, { useState } from 'react'
import { db } from './firestore'
import {  doc, setDoc } from '@firebase/firestore'

import { PlayerSection } from './styles'

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
				<input value={text} onChange={(e) => setText(e.target.value)} />
			</form>
		</PlayerSection>
	)
}

export default Player