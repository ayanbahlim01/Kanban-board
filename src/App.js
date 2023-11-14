// App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { faUser, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./App.css";

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [groupingOption, setGroupingOption] = useState("status");
  const [sortOption, setSortOption] = useState("priority");
  const [users, setUsers] = useState([]);
  const [displayDropdowns, setDisplayDropdowns] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api.quicksell.co/v1/internal/frontend-assignment"
      );
      setTickets(response.data.tickets);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const groupAndSortTickets = () => {
    let groupedAndSortedTickets = [...tickets];

    if (groupingOption === "status") {
      groupedAndSortedTickets.sort((a, b) => a.status.localeCompare(b.status));
    } else if (groupingOption === "user") {
      groupedAndSortedTickets.sort((a, b) => a.userId.localeCompare(b.userId));
    } else if (groupingOption === "priority") {
      groupedAndSortedTickets.sort((a, b) => b.priority - a.priority);
    }

    if (sortOption === "title") {
      groupedAndSortedTickets.sort((a, b) => a.title.localeCompare(b.title));
    }

    setTickets(groupedAndSortedTickets);
  };

  const handleGroupingChange = (option) => {
    setGroupingOption(option);
    groupAndSortTickets();
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    groupAndSortTickets();
  };

  const renderColumns = () => {
    const groupedTickets = {};
    tickets.forEach((ticket) => {
      const groupKey =
        groupingOption === "user" ? ticket.userId : ticket[groupingOption];
      if (!groupedTickets[groupKey]) {
        groupedTickets[groupKey] = [];
      }
      groupedTickets[groupKey].push(ticket);
    });

    return Object.keys(groupedTickets).map((groupKey) => (
      <div key={groupKey} className="kanban-column">
        <div className="kanban-column-heading">
          <p>
            {groupingOption === "status" && (
              <>
                {getStatusEmoji(groupKey)}{' '}
                {getUserProfilePicture(groupKey)} {getHeadingText(groupKey)}
              </>
            )}
            {groupingOption === "user" && (
              <>
                {getUserProfilePicture(groupKey)} {getHeadingText(groupKey)}
              </>
            )}
            {groupingOption === "priority" && (
              <>
                {getPriorityEmoji(groupKey)}{' '}
                {getUserProfilePicture(groupKey)} {getHeadingText(groupKey)}
              </>
            )}
            ({groupedTickets[groupKey].length})
          </p>
        </div>
        {groupedTickets[groupKey].map((ticket) => (
  <div key={ticket.id} className="kanban-card">
    <div className="top-right-container">
      {getUserProfilePicture(ticket.userId, true)}
    </div>
    <p className="ticket-id">{ticket.id}</p>
    <p className="ticket-title">{ticket.title}</p>
    <div className="ticket-details">
      {groupingOption === "status" && (
        <>
          {getStatusEmoji(ticket.status)}
          {getPriorityEmoji(ticket.priority)}
          {getTagWithGreyDot("Feature Request")}
        </>
      )}
      {groupingOption === "user" && (
        <>
          {getPriorityEmoji(ticket.priority)}
          {getTagWithGreyDot("Feature Request")}
        </>
      )}
      {groupingOption === "priority" && (
        <>
          {getPriorityEmoji(ticket.priority)}
          {getTagWithGreyDot("Feature Request")}
        </>
      )}
    </div>
  </div>
))}


      </div>
    ));
  };

  const getStatusEmoji = (status) => {
    const emojiMap = {
      Todo: '○',
      'In progress': '⌛',
      Done: '✅',
      Backlog: '📥',
    };

    return emojiMap[status] || '';
  };

  const getPriorityEmoji = (priority) => {
    const emojiMap = {
      0: '---',
      1: '🚨',
      2: '🔴',
      3: '🟡',
      4: '🟢',
    };

    return emojiMap[priority] || '';
  };

  const getUserProfilePicture = (userId, smallCircle = false) => {
    const user = users.find((user) => user.id === userId);
  
    if (user) {
      const initials = user.name.charAt(0).toUpperCase();
  
      return smallCircle ? (
        <span className="user-profile-circle">{initials}</span>
      ) : (
        <span className="user-profile">{initials}</span>
      );
    }
  
    return null;
  };
  

  const getTagWithGreyDot = (tag) => {
    const greyDot = '🔘';

    return (
      <div className="tag-container">
        {greyDot} {tag}
      </div>
    );
  };

  const getHeadingText = (groupKey) => {
    if (groupingOption === "status") {
      return (
        <span>
          {groupKey}
        </span>
      );
    } else if (groupingOption === "user") {
      return (
        <span>
          {getUserProfile(groupKey)}
        </span>
      );
    } else if (groupingOption === "priority") {
      return (
        <span>
          {getUserProfilePicture(groupKey)}  {getPriorityLabel(parseInt(groupKey, 10))}
        </span>
      );
    } else {
      return groupKey;
    }
  };

  const getUserProfile = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "Unknown User";
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 0:
        return "No Priority";
      case 1:
        return "Urgent";
      case 2:
        return "High";
      case 3:
        return "Medium";
      case 4:
        return "Low";
      default:
        return "Unknown Priority";
    }
  };


  return (
    <div>
      <div className="topnav">
        <button onClick={() => setDisplayDropdowns(!displayDropdowns)}>
          <span>⚙️</span>Display ↓
        </button>
        {displayDropdowns && (
          <div className="nested-dropdowns">
            <div className="dropdown">
              <label>Grouping</label>
              <select
                onChange={(e) => handleGroupingChange(e.target.value)}
                value={groupingOption}
              >
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <div className="dropdown">
              <label>Ordering</label>
              <select
                onChange={(e) => handleSortChange(e.target.value)}
                value={sortOption}
              >
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="kanban-board">{renderColumns()}</div>
    </div>
  );
};

export default App;
