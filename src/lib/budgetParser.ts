// Utility function to parse the budget data from data.txt format
export function parseBudgetData(rawData: string) {
  const lines = rawData.split('\n');
  const result: Record<string, any> = {};
  let currentSection: string[] = [];
  let currentItems: Record<string, any> = {};
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    // Check for section headers (A:)
    if (trimmedLine.startsWith('A:')) {
      const sectionName = trimmedLine.substring(2).trim().split('{')[0].trim();
      currentSection = [sectionName];
      result[sectionName] = { General: { Items: {} } };
      currentItems = result[sectionName].General.Items;
      continue;
    }
    
    // Check for subsection headers (B:)
    if (trimmedLine.startsWith('B:')) {
      const subsectionName = trimmedLine.substring(2).trim().split('{')[0].trim();
      if (!result[currentSection[0]].General[subsectionName]) {
        result[currentSection[0]].General[subsectionName] = { Items: {} };
      }
      currentItems = result[currentSection[0]].General[subsectionName].Items;
      continue;
    }
    
    // Check for item entries (D:)
    if (trimmedLine.startsWith('D:')) {
      const itemContent = trimmedLine.substring(2).trim();
      const match = itemContent.match(/"([^"]+)"\s*–\s*\(\$([\d,]+\.?\d*)\)/);
      if (match) {
        const [, itemName, valueStr] = match;
        const value = parseFloat(valueStr.replace(/,/g, ''));
        currentItems[itemName] = { value };
      }
      continue;
    }
    
    // Check for subitem entries (E:)
    if (trimmedLine.startsWith('E:')) {
      const itemContent = trimmedLine.substring(2).trim();
      const match = itemContent.match(/"([^"]+)"\s*–\s*\(\$([\d,]+\.?\d*)\)/);
      if (match) {
        const [, itemName, valueStr] = match;
        const value = parseFloat(valueStr.replace(/,/g, ''));
        // Add subitem to the last item in currentItems
        const lastItemKey = Object.keys(currentItems).pop();
        if (lastItemKey) {
          if (!currentItems[lastItemKey].Subitems) {
            currentItems[lastItemKey].Subitems = {};
          }
          currentItems[lastItemKey].Subitems[itemName] = { value };
        }
      }
      continue;
    }
  }
  
  return result;
} 