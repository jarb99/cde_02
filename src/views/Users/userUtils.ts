const getFullName = (firstName?: string, lastName?: string) =>
  `${firstName || ""} ${lastName || ""}`.trim();

const getDomainName = (emailAddress?: string): string => {
  if (!emailAddress) {
    return "";
  }
  
  let re = /.*?@(.*)/g;
  let matches = re.exec(emailAddress);
  
  if (matches && matches.length === 2) {
    return matches[1];
  }
  
  return "";
};

export { getFullName, getDomainName };