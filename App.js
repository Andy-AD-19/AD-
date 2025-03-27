import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
	const [page, setPage] = useState('welcome')
	const [therapies, setTherapies] = useState([])
	const [selectedCondition, setSelectedCondition] = useState(null)
	const [loading, setLoading] = useState(false)
	const [typedText, setTypedText] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [animationKey, setAnimationKey] = useState(0)
	const conditionsPerPage = 3

	useEffect(() => {
		const fetchTherapies = async () => {
			try {
				const response = await axios.get('http://localhost:5000/api/therapies')
				console.log('Therapies fetched:', response.data)
				setTherapies(response.data)
			} catch (err) {
				console.error('Fetch error:', err)
			}
		}
		fetchTherapies()
	}, [])

	const handleProceed = () => {
		console.log('Proceeding to conditions')
		setPage('conditions')
	}

	const handleConditionClick = (condition) => {
		console.log('Condition selected:', condition)
		setSelectedCondition(condition)
		setLoading(true)
		setTypedText('') // Reset text
		setTimeout(() => {
			setLoading(false)
			const cleanInterventions = condition.interventions
				.filter((item) => item && typeof item === 'string') // Remove null/undefined
				.map((item) => item.trim()) // Trim whitespace
			console.log('Cleaned interventions:', cleanInterventions) // Debug
			const fullText = cleanInterventions.join(' ')
			console.log('Full text to type:', fullText) // Debug
			typeText(fullText)
		}, 3000)
	}

	const typeText = (text) => {
		let index = 0
		setTypedText('') // Ensure we start fresh
		const interval = setInterval(() => {
			if (index <= text.length) {
				// Include full length
				setTypedText(text.slice(0, index)) // Slice from start
				index++
			} else {
				clearInterval(interval)
				console.log('Final typed text:', text) // Debug
			}
		}, 50)
	}

	const handleClosePopup = () => {
		console.log('Closing treatments popup')
		setSelectedCondition(null)
		setTypedText('')
	}

	const reloadPage = () => window.location.reload()

	const indexOfLastCondition = currentPage * conditionsPerPage
	const indexOfFirstCondition = indexOfLastCondition - conditionsPerPage
	const currentConditions = therapies.slice(
		indexOfFirstCondition,
		indexOfLastCondition
	)
	const totalPages = Math.ceil(therapies.length / conditionsPerPage)

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setAnimationKey((prev) => prev + 1)
			setCurrentPage(currentPage + 1)
		}
	}

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setAnimationKey((prev) => prev + 1)
			setCurrentPage(currentPage - 1)
		}
	}

	return (
		<div className='app'>
			{page === 'welcome' && (
				<div className='welcome-wrapper'>
					<h1 className='logo' onClick={reloadPage}>
						ANDY AD.
					</h1>
					<button className='proceed-btn' onClick={handleProceed}>
						Proceed
					</button>
				</div>
			)}

			{page === 'conditions' && (
				<div className='conditions-popup'>
					{therapies.length > 0 ? (
						<>
							<div className='conditions-grid-wrapper'>
								<div className='conditions-grid' key={animationKey}>
									{currentConditions.map((therapy) => (
										<button
											key={therapy.condition}
											className='condition-btn'
											onClick={() => handleConditionClick(therapy)}
										>
											{therapy.condition}
										</button>
									))}
								</div>
							</div>
							<div className='pagination'>
								<button
									className='pagination-btn'
									onClick={handlePrevPage}
									disabled={currentPage === 1}
								>
									Prev
								</button>
								<span>{`Page ${currentPage} of ${totalPages}`}</span>
								<button
									className='pagination-btn'
									onClick={handleNextPage}
									disabled={currentPage === totalPages}
								>
									Next
								</button>
							</div>
						</>
					) : (
						<p>
							No conditions loaded. Is the backend running at
							http://localhost:5000?
						</p>
					)}
				</div>
			)}

			{selectedCondition && (
				<>
					<div className='overlay' />
					<div className='condition-detail-popup'>
						<h1 className='condition-title'>{selectedCondition.condition}</h1>
						{loading ? (
							<img
								src='/loading.gif'
								alt='Loading...'
								className='loading-gif'
							/>
						) : (
							<p className='typed-text'>
								{typedText || 'No treatments available.'}
							</p>
						)}
						<button className='close-btn' onClick={handleClosePopup}>
							X
						</button>
					</div>
				</>
			)}
		</div>
	)
}

export default App
