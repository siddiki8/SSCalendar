  <Select
    value={selectedCalendarEdit}
    onValueChange={(val) => {
      setSelectedCalendarEdit(val);
      const [startYear, endYear] = val.split("-").map(Number);
      // Set defaults: first Sunday of September for the start year (month index 8) 
      // and last Sunday of June for the end year (month index 5)
      setFirstSundayEdit(getFirstSundayInMonth(startYear, 8));
      setLastSundayEdit(getLastSundayInMonth(endYear, 5));
    }}
  >
    <SelectTrigger className="w-48">
      <SelectValue placeholder="Select Calendar" />
    </SelectTrigger>
    <SelectContent>
      {calendarOptions.map(opt => (
        <SelectItem key={opt} value={opt}>
          {opt}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  <Select value={liveCalendar} onValueChange={setLiveCalendar}>
    <SelectTrigger className="w-48">
      <SelectValue placeholder="Select Live Calendar" />
    </SelectTrigger>
    <SelectContent>
      {calendarOptions.map(opt => (
        <SelectItem key={opt} value={opt}>
          {opt}
        </SelectItem>
      ))}
    </SelectContent>
  </Select> 