import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import Chat from './Chat'
import Player from './Player'
import { Root, Container } from './styles'

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
					users={[
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
