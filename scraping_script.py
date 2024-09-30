def scrape_data():
    url = 'https://example.com/dance-events'  # Replace with the actual URL
    response = requests.get(url)

    # Print the entire HTML of the page to inspect if it's loading correctly
    print(response.text)

    soup = BeautifulSoup(response.text, 'html.parser')

    events = []
    # Adjust these selectors based on the actual page structure
    for result in soup.find_all('div', class_='event-item'):
        title = result.find('h2').text if result.find('h2') else "No title"
        date = result.find('span', class_='event-date').text if result.find('span', 'event-date') else "No date"
        link = result.find('a')['href'] if result.find('a') else "#"
        events.append({'title': title, 'date': date, 'link': link})

    print(events)  # Print the scraped events to check if it's fetching any data

    if events:
        df = pd.DataFrame(events)
        df.to_csv('events_data.csv', index=False)
        print("Events data saved to CSV")
    else:
        print("No events found")
