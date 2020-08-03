import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { returnedSearch, fetchedFood2 } from '../test-data';
import { fetchFood, fetchSearch } from '../apiCalls';
jest.mock('../apiCalls');

describe('App', () => {
	beforeEach(() => {
		fetchSearch.mockResolvedValue(() => {
			return returnedSearch
		});
	
		fetchFood.mockResolvedValue(() => {
			return fetchedFood2
		});
	})

	it('Renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<MemoryRouter><App /></MemoryRouter>, div);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('Landing page contains the Header, LogHistory, and EntryForm components', () => {
		const { getByLabelText, getByText } = render(
			<MemoryRouter><App /></MemoryRouter>
		);

		const appTitle = getByText('Food Diary');
		const headerBtn = getByText('TRENDS');
		const foodHistoryTitle = getByText('Food History');
		const searchInput = getByLabelText('search');
		const entryForm = getByText('New Food Entry');
		
		expect(appTitle).toBeInTheDocument();
		expect(headerBtn).toBeInTheDocument();
		expect(foodHistoryTitle).toBeInTheDocument();
		expect(searchInput).toBeInTheDocument();
		expect(entryForm).toBeInTheDocument();
	});

	it('When Trends button is clicked, the Trends component renders', () => {
		const { getByText } = render(
			<MemoryRouter><App /></MemoryRouter>
		);

		const trendsBtn = getByText('TRENDS');

		fireEvent.click(trendsBtn);

		const trendsTitle = getByText('Trends');
		const clearBtn = getByText('CLEAR');
	
		expect(trendsTitle).toBeInTheDocument();
		expect(clearBtn).toBeInTheDocument();
	});

	it('On the Trends page, the back button takes user back to Home', () => {
		const { getByAltText, getByText } = render(
			<MemoryRouter><App /></MemoryRouter>
		);

		const trendsBtn = getByText('TRENDS');

		fireEvent.click(trendsBtn);

		const backBtn = getByAltText('Back icon');

		fireEvent.click(backBtn)

		const entryFormTitle = getByText('New Food Entry');

		expect(entryFormTitle).toBeInTheDocument();
	});

	it('When food log is expanded, the LogDetails component renders', () => {
		const { getAllByAltText, getByText } = render(
			<MemoryRouter><App /></MemoryRouter>
		);

		const trendsBtn = getAllByAltText('Expand log');

		fireEvent.click(trendsBtn[0])

		const foodLogInfo1 = getByText('You reportedly ate');
		const foodLogInfo2 = getByText('hummus on this day.');

		expect(foodLogInfo1).toBeInTheDocument();
		expect(foodLogInfo2).toBeInTheDocument();
	});

	it('On the LogDetails page, the back button takes user back to Home', () => {
		const { getAllByAltText, getByAltText, getByText } = render(
			<MemoryRouter><App /></MemoryRouter>
		);

		const trendsBtn = getAllByAltText('Expand log');

		fireEvent.click(trendsBtn[0])

		const backBtn = getByAltText('Back icon');

		fireEvent.click(backBtn);

		const entryFormTitle = getByText('New Food Entry');

		expect(entryFormTitle).toBeInTheDocument();
	});

	it('The application title brings the user back to Home', () => {
		const { getAllByAltText, getByText } = render(
			<MemoryRouter><App /></MemoryRouter>
		);

		const trendsBtn = getAllByAltText('Expand log');

		fireEvent.click(trendsBtn[0])

		const appTitle = getByText('Food Diary');

		fireEvent.click(appTitle);

		const entryFormTitle = getByText('New Food Entry');

		expect(entryFormTitle).toBeInTheDocument();
	});

	it('On the EntryForm, the search input retrieves data actively', async () => {
		const { getByLabelText, getByText, debug } = render(
			<MemoryRouter><App /></MemoryRouter>
		);

		const searchInput = getByLabelText('search');

		fireEvent.keyDown(searchInput)
		
		const searchResult1 = await waitFor(() => getByText('apple'))
		debug()
		// const appTitle = getByText('Food Diary');

		// fireEvent.click(appTitle);

		// const entryFormTitle = getByText('New Food Entry');

		// expect(entryFormTitle).toBeInTheDocument();
	});
	
	//clicking item in result list, food info displays
	//clicking add, adds it to the form
	//submitting the form adds a new food history log

	it.skip('From the homepage, if Details button is clicked, user should be directed to the CocktailDetails page', async () => {
		const { getByLabelText, getByText, getByPlaceholderText, debug } = render(
			<MemoryRouter><App /></MemoryRouter>
		);
		
		const nameInput = getByPlaceholderText('username');
		const submitBtn = getByLabelText('over-21-button');

		fireEvent.change(nameInput, {target: {value: 'GG'}});
		fireEvent.click(submitBtn);

		const detailsBtn = await waitFor(() => getByText('Make Me'));

		fireEvent.click(detailsBtn);

		debug();

		const detailsInstructions = await waitFor(() => getByText('Fill glass with ice and fish, add vodka, grape soda and orange juice. DO NOT STIR!!!!! Serve well chilled.'));
		expect(detailsInstructions).toBeInTheDocument();
	});
})