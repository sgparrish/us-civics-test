/**
 * Source data from USCIS 2025 Civics Test (128 questions).
 * Run: node scripts/build-civics-data.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const S = {
  govP: 'American Government — Principles of American Government',
  govS: 'American Government — System of Government',
  govR: 'American Government — Rights and Responsibilities',
  histC: 'American History — Colonial Period and Independence',
  hist18: 'American History — 1800s',
  histR: 'American History — Recent American History',
  sym: 'Symbols',
  hol: 'Holidays',
}

/** @type {{ id: number, section: string, q: string, a: string[], s?: boolean }[]} */
const raw = [
  { id: 1, section: S.govP, q: 'What is the form of government of the United States?', a: ['Republic', 'Constitution-based federal republic', 'Representative democracy'] },
  { id: 2, section: S.govP, q: 'What is the supreme law of the land?', a: ['(U.S.) Constitution', 'U.S. Constitution', 'Constitution'], s: true },
  { id: 3, section: S.govP, q: 'Name one thing the U.S. Constitution does.', a: ['Forms the government', 'Defines powers of government', 'Defines the parts of government', 'Protects the rights of the people'] },
  { id: 4, section: S.govP, q: 'The U.S. Constitution starts with the words “We the People.” What does “We the People” mean?', a: ['Self-government', 'Popular sovereignty', 'Consent of the governed', 'People should govern themselves', '(Example of) social contract', 'Social contract'] },
  { id: 5, section: S.govP, q: 'How are changes made to the U.S. Constitution?', a: ['Amendments', 'The amendment process'] },
  { id: 6, section: S.govP, q: 'What does the Bill of Rights protect?', a: ['(The basic) rights of Americans', 'The basic rights of Americans', '(The basic) rights of people living in the United States', 'The basic rights of people living in the United States'] },
  { id: 7, section: S.govP, q: 'How many amendments does the U.S. Constitution have?', a: ['Twenty-seven (27)', '27', 'Twenty-seven'], s: true },
  { id: 8, section: S.govP, q: 'Why is the Declaration of Independence important?', a: ['It says America is free from British control.', 'It says all people are created equal.', 'It identifies inherent rights.', 'It identifies individual freedoms.'] },
  { id: 9, section: S.govP, q: 'What founding document said the American colonies were free from Britain?', a: ['Declaration of Independence'] },
  { id: 10, section: S.govP, q: 'Name two important ideas from the Declaration of Independence and the U.S. Constitution.', a: ['Equality', 'Liberty', 'Social contract', 'Natural rights', 'Limited government', 'Self-government'] },
  { id: 11, section: S.govP, q: 'The words “Life, Liberty, and the pursuit of Happiness” are in what founding document?', a: ['Declaration of Independence'] },
  { id: 12, section: S.govP, q: 'What is the economic system of the United States?', a: ['Capitalism', 'Free market economy'], s: true },
  { id: 13, section: S.govP, q: 'What is the rule of law?', a: ['Everyone must follow the law.', 'Leaders must obey the law.', 'Government must obey the law.', 'No one is above the law.'] },
  { id: 14, section: S.govP, q: 'Many documents influenced the U.S. Constitution. Name one.', a: ['Declaration of Independence', 'Articles of Confederation', 'Federalist Papers', 'Anti-Federalist Papers', 'Virginia Declaration of Rights', 'Fundamental Orders of Connecticut', 'Mayflower Compact', 'Iroquois Great Law of Peace'] },
  { id: 15, section: S.govP, q: 'There are three branches of government. Why?', a: ['So one part does not become too powerful', 'Checks and balances', 'Separation of powers'] },
  { id: 16, section: S.govS, q: 'Name the three branches of government.', a: ['Legislative, executive, and judicial', 'Congress, president, and the courts'] },
  { id: 17, section: S.govS, q: 'The President of the United States is in charge of which branch of government?', a: ['Executive branch'] },
  { id: 18, section: S.govS, q: 'What part of the federal government writes laws?', a: ['(U.S.) Congress', 'U.S. Congress', 'Congress', '(U.S. or national) legislature', 'Legislative branch'] },
  { id: 19, section: S.govS, q: 'What are the two parts of the U.S. Congress?', a: ['Senate and House (of Representatives)', 'Senate and House of Representatives', 'Senate and House'] },
  { id: 20, section: S.govS, q: 'Name one power of the U.S. Congress.', a: ['Writes laws', 'Declares war', 'Makes the federal budget'], s: true },
  { id: 21, section: S.govS, q: 'How many U.S. senators are there?', a: ['One hundred (100)', '100'] },
  { id: 22, section: S.govS, q: 'How long is a term for a U.S. senator?', a: ['Six (6) years', 'Six years', '6 years'] },
  { id: 23, section: S.govS, q: 'Who is one of your state’s U.S. senators now?', a: ['Answers will vary. [District of Columbia residents and residents of U.S. territories should answer that D.C. (or the territory where the applicant lives) has no U.S. senators.]', 'Answers will vary'] },
  { id: 24, section: S.govS, q: 'How many voting members are in the House of Representatives?', a: ['Four hundred thirty-five (435)', '435'] },
  { id: 25, section: S.govS, q: 'How long is a term for a member of the House of Representatives?', a: ['Two (2) years', 'Two years', '2 years'] },
  { id: 26, section: S.govS, q: 'Why do U.S. representatives serve shorter terms than U.S. senators?', a: ['To more closely follow public opinion'] },
  { id: 27, section: S.govS, q: 'How many senators does each state have?', a: ['Two (2)', 'Two', '2'] },
  { id: 28, section: S.govS, q: 'Why does each state have two senators?', a: ['Equal representation (for small states)', 'The Great Compromise (Connecticut Compromise)', 'Equal representation', 'The Great Compromise', 'Connecticut Compromise'] },
  { id: 29, section: S.govS, q: 'Name your U.S. representative.', a: ['Answers will vary. [Residents of territories with nonvoting Delegates or Resident Commissioners may provide the name of that Delegate or Commissioner. Also acceptable is any statement that the territory has no (voting) representatives in Congress.]', 'Answers will vary'] },
  { id: 30, section: S.govS, q: 'What is the name of the Speaker of the House of Representatives now?', a: ['Visit uscis.gov/citizenship/testupdates for the name of the Speaker of the House of Representatives.'], s: true },
  { id: 31, section: S.govS, q: 'Who does a U.S. senator represent?', a: ['Citizens of their state', 'People of their state'] },
  { id: 32, section: S.govS, q: 'Who elects U.S. senators?', a: ['Citizens from their state'] },
  { id: 33, section: S.govS, q: 'Who does a member of the House of Representatives represent?', a: ['Citizens in their (congressional) district', 'Citizens in their district', 'People from their (congressional) district', 'People in their district'] },
  { id: 34, section: S.govS, q: 'Who elects members of the House of Representatives?', a: ['Citizens from their (congressional) district'] },
  { id: 35, section: S.govS, q: 'Some states have more representatives than other states. Why?', a: ['(Because of) the state’s population', '(Because) they have more people', '(Because) some states have more people', 'Because of the state’s population', 'Because they have more people'] },
  { id: 36, section: S.govS, q: 'The President of the United States is elected for how many years?', a: ['Four (4) years', 'Four years', '4 years'], s: true },
  { id: 37, section: S.govS, q: 'The President of the United States can serve only two terms. Why?', a: ['(Because of) the 22nd Amendment', 'To keep the president from becoming too powerful', 'Because of the 22nd Amendment', '22nd Amendment'] },
  { id: 38, section: S.govS, q: 'What is the name of the President of the United States now?', a: ['Visit uscis.gov/citizenship/testupdates for the name of the President of the United States.'], s: true },
  { id: 39, section: S.govS, q: 'What is the name of the Vice President of the United States now?', a: ['Visit uscis.gov/citizenship/testupdates for the name of the Vice President of the United States.'], s: true },
  { id: 40, section: S.govS, q: 'If the president can no longer serve, who becomes president?', a: ['The Vice President (of the United States)', 'The Vice President', 'Vice President'] },
  { id: 41, section: S.govS, q: 'Name one power of the president.', a: ['Signs bills into law', 'Vetoes bills', 'Enforces laws', 'Commander in Chief (of the military)', 'Commander in Chief', 'Chief diplomat', 'Appoints federal judges'] },
  { id: 42, section: S.govS, q: 'Who is Commander in Chief of the U.S. military?', a: ['The President (of the United States)', 'The President', 'President'] },
  { id: 43, section: S.govS, q: 'Who signs bills to become laws?', a: ['The President (of the United States)', 'The President', 'President'] },
  { id: 44, section: S.govS, q: 'Who vetoes bills?', a: ['The President (of the United States)', 'The President', 'President'], s: true },
  { id: 45, section: S.govS, q: 'Who appoints federal judges?', a: ['The President (of the United States)', 'The President', 'President'] },
  { id: 46, section: S.govS, q: 'The executive branch has many parts. Name one.', a: ['President (of the United States)', 'President', 'Cabinet', 'Federal departments and agencies'] },
  { id: 47, section: S.govS, q: 'What does the President’s Cabinet do?', a: ['Advises the President (of the United States)', 'Advises the President'] },
  { id: 48, section: S.govS, q: 'What are two Cabinet-level positions?', a: ['Attorney General', 'Secretary of Agriculture', 'Secretary of Commerce', 'Secretary of Education', 'Secretary of Energy', 'Secretary of Health and Human Services', 'Secretary of Homeland Security', 'Secretary of Housing and Urban Development', 'Secretary of the Interior', 'Secretary of Labor', 'Secretary of State', 'Secretary of Transportation', 'Secretary of the Treasury', 'Secretary of Veterans Affairs', 'Secretary of War (Defense)', 'Vice-President', 'Administrator of the Environmental Protection Agency', 'Administrator of the Small Business Administration', 'Director of the Central Intelligence Agency', 'Director of the Office of Management and Budget', 'Director of National Intelligence', 'United States Trade Representative'] },
  { id: 49, section: S.govS, q: 'Why is the Electoral College important?', a: ['It decides who is elected president.', 'It provides a compromise between the popular election of the president and congressional selection.'] },
  { id: 50, section: S.govS, q: 'What is one part of the judicial branch?', a: ['Supreme Court', 'Federal Courts'] },
  { id: 51, section: S.govS, q: 'What does the judicial branch do?', a: ['Reviews laws', 'Explains laws', 'Resolves disputes (disagreements) about the law', 'Decides if a law goes against the (U.S.) Constitution', 'Decides if a law goes against the U.S. Constitution'] },
  { id: 52, section: S.govS, q: 'What is the highest court in the United States?', a: ['Supreme Court'], s: true },
  { id: 53, section: S.govS, q: 'How many seats are on the Supreme Court?', a: ['Nine (9)', '9'] },
  { id: 54, section: S.govS, q: 'How many Supreme Court justices are usually needed to decide a case?', a: ['Five (5)', '5'] },
  { id: 55, section: S.govS, q: 'How long do Supreme Court justices serve?', a: ['(For) life', 'Lifetime appointment', '(Until) retirement', 'Life', 'Until retirement'] },
  { id: 56, section: S.govS, q: 'Supreme Court justices serve for life. Why?', a: ['To be independent (of politics)', 'To limit outside (political) influence', 'To be independent of politics', 'To limit outside political influence'] },
  { id: 57, section: S.govS, q: 'Who is the Chief Justice of the United States now?', a: ['Visit uscis.gov/citizenship/testupdates for the name of the Chief Justice of the United States.'] },
  { id: 58, section: S.govS, q: 'Name one power that is only for the federal government.', a: ['Print paper money', 'Mint coins', 'Declare war', 'Create an army', 'Make treaties', 'Set foreign policy'] },
  { id: 59, section: S.govS, q: 'Name one power that is only for the states.', a: ['Provide schooling and education', 'Provide protection (police)', 'Provide safety (fire departments)', 'Give a driver’s license', 'Approve zoning and land use'] },
  { id: 60, section: S.govS, q: 'What is the purpose of the 10th Amendment?', a: ['(It states that the) powers not given to the federal government belong to the states or to the people.', 'Powers not given to the federal government belong to the states or to the people.'] },
  { id: 61, section: S.govS, q: 'Who is the governor of your state now?', a: ['Answers will vary. [District of Columbia residents should answer that D.C. does not have a governor.]', 'Answers will vary'], s: true },
  { id: 62, section: S.govS, q: 'What is the capital of your state?', a: ['Answers will vary. [District of Columbia residents should answer that D.C. is not a state and does not have a capital. Residents of U.S. territories should name the capital of the territory.]', 'Answers will vary'] },
  { id: 63, section: S.govR, q: 'There are four amendments to the U.S. Constitution about who can vote. Describe one of them.', a: ['Citizens eighteen (18) and older (can vote).', 'You don’t have to pay (a poll tax) to vote.', 'Any citizen can vote. (Women and men can vote.)', 'A male citizen of any race (can vote).'] },
  { id: 64, section: S.govR, q: 'Who can vote in federal elections, run for federal office, and serve on a jury in the United States?', a: ['Citizens', 'Citizens of the United States', 'U.S. citizens'] },
  { id: 65, section: S.govR, q: 'What are three rights of everyone living in the United States?', a: ['Freedom of expression', 'Freedom of speech', 'Freedom of assembly', 'Freedom to petition the government', 'Freedom of religion', 'The right to bear arms'] },
  { id: 66, section: S.govR, q: 'What do we show loyalty to when we say the Pledge of Allegiance?', a: ['The United States', 'The flag'], s: true },
  { id: 67, section: S.govR, q: 'Name two promises that new citizens make in the Oath of Allegiance.', a: ['Give up loyalty to other countries', 'Defend the (U.S.) Constitution', 'Defend the U.S. Constitution', 'Obey the laws of the United States', 'Serve in the military (if needed)', 'Serve (help, do important work for) the nation (if needed)', 'Be loyal to the United States'] },
  { id: 68, section: S.govR, q: 'How can people become United States citizens?', a: ['Be born in the United States, under the conditions set by the 14th Amendment', 'Naturalize', 'Derive citizenship (under conditions set by Congress)'] },
  { id: 69, section: S.govR, q: 'What are two examples of civic participation in the United States?', a: ['Vote', 'Run for office', 'Join a political party', 'Help with a campaign', 'Join a civic group', 'Join a community group', 'Give an elected official your opinion (on an issue)', 'Contact elected officials', 'Support or oppose an issue or policy', 'Write to a newspaper'] },
  { id: 70, section: S.govR, q: 'What is one way Americans can serve their country?', a: ['Vote', 'Pay taxes', 'Obey the law', 'Serve in the military', 'Run for office', 'Work for local, state, or federal government'] },
  { id: 71, section: S.govR, q: 'Why is it important to pay federal taxes?', a: ['Required by law', 'All people pay to fund the federal government', 'Required by the (U.S.) Constitution (16th Amendment)', 'Required by the U.S. Constitution (16th Amendment)', 'Civic duty'] },
  { id: 72, section: S.govR, q: 'It is important for all men age 18 through 25 to register for the Selective Service. Name one reason why.', a: ['Required by law', 'Civic duty', 'Makes the draft fair, if needed'] },
  { id: 73, section: S.histC, q: 'The colonists came to America for many reasons. Name one.', a: ['Freedom', 'Political liberty', 'Religious freedom', 'Economic opportunity', 'Escape persecution'] },
  { id: 74, section: S.histC, q: 'Who lived in America before the Europeans arrived?', a: ['American Indians', 'Native Americans'], s: true },
  { id: 75, section: S.histC, q: 'What group of people was taken and sold as slaves?', a: ['Africans', 'People from Africa'] },
  { id: 76, section: S.histC, q: 'What war did the Americans fight to win independence from Britain?', a: ['American Revolution', 'The (American) Revolutionary War', 'Revolutionary War', 'War for (American) Independence'] },
  { id: 77, section: S.histC, q: 'Name one reason why the Americans declared independence from Britain.', a: ['High taxes', 'Taxation without representation', 'British soldiers stayed in Americans’ houses (boarding, quartering)', 'They did not have self-government', 'Boston Massacre', 'Boston Tea Party (Tea Act)', 'Stamp Act', 'Sugar Act', 'Townshend Acts', 'Intolerable (Coercive) Acts'] },
  { id: 78, section: S.histC, q: 'Who wrote the Declaration of Independence?', a: ['(Thomas) Jefferson', 'Thomas Jefferson', 'Jefferson'], s: true },
  { id: 79, section: S.histC, q: 'When was the Declaration of Independence adopted?', a: ['July 4, 1776'] },
  { id: 80, section: S.histC, q: 'The American Revolution had many important events. Name one.', a: ['(Battle of) Bunker Hill', 'Declaration of Independence', 'Washington Crossing the Delaware (Battle of Trenton)', '(Battle of) Saratoga', 'Valley Forge (Encampment)', '(Battle of) Yorktown (British surrender at Yorktown)', 'Battle of Bunker Hill', 'Battle of Saratoga', 'Battle of Yorktown'] },
  { id: 81, section: S.histC, q: 'There were 13 original states. Name five.', a: ['New Hampshire', 'Massachusetts', 'Rhode Island', 'Connecticut', 'New York', 'New Jersey', 'Pennsylvania', 'Delaware', 'Maryland', 'Virginia', 'North Carolina', 'South Carolina', 'Georgia'] },
  { id: 82, section: S.histC, q: 'What founding document was written in 1787?', a: ['(U.S.) Constitution', 'U.S. Constitution', 'Constitution'] },
  { id: 83, section: S.histC, q: 'The Federalist Papers supported the passage of the U.S. Constitution. Name one of the writers.', a: ['(James) Madison', 'James Madison', '(Alexander) Hamilton', 'Alexander Hamilton', '(John) Jay', 'John Jay', 'Publius'] },
  { id: 84, section: S.histC, q: 'Why were the Federalist Papers important?', a: ['They helped people understand the (U.S.) Constitution.', 'They supported passing the (U.S.) Constitution.', 'They helped people understand the U.S. Constitution.', 'They supported passing the U.S. Constitution.'] },
  { id: 85, section: S.histC, q: 'Benjamin Franklin is famous for many things. Name one.', a: ['Founded the first free public libraries', 'First Postmaster General of the United States', 'Helped write the Declaration of Independence', 'Inventor', 'U.S. diplomat'] },
  { id: 86, section: S.histC, q: 'George Washington is famous for many things. Name one.', a: ['“Father of Our Country”', 'Father of Our Country', 'First president of the United States', 'General of the Continental Army', 'President of the Constitutional Convention'], s: true },
  { id: 87, section: S.hist18, q: 'Thomas Jefferson is famous for many things. Name one.', a: ['Writer of the Declaration of Independence', 'Third president of the United States', 'Doubled the size of the United States (Louisiana Purchase)', 'First Secretary of State', 'Founded the University of Virginia', 'Writer of the Virginia Statute on Religious Freedom'] },
  { id: 88, section: S.hist18, q: 'James Madison is famous for many things. Name one.', a: ['“Father of the Constitution”', 'Father of the Constitution', 'Fourth president of the United States', 'President during the War of 1812', 'One of the writers of the Federalist Papers'] },
  { id: 89, section: S.hist18, q: 'Alexander Hamilton is famous for many things. Name one.', a: ['First Secretary of the Treasury', 'One of the writers of the Federalist Papers', 'Helped establish the First Bank of the United States', 'Aide to General George Washington', 'Member of the Continental Congress'] },
  { id: 90, section: S.hist18, q: 'What territory did the United States buy from France in 1803?', a: ['Louisiana Territory', 'Louisiana'] },
  { id: 91, section: S.hist18, q: 'Name one war fought by the United States in the 1800s.', a: ['War of 1812', 'Mexican-American War', 'Civil War', 'Spanish-American War'] },
  { id: 92, section: S.hist18, q: 'Name the U.S. war between the North and the South.', a: ['The Civil War', 'Civil War'] },
  { id: 93, section: S.hist18, q: 'The Civil War had many important events. Name one.', a: ['(Battle of) Fort Sumter', 'Emancipation Proclamation', '(Battle of) Vicksburg', '(Battle of) Gettysburg', 'Sherman’s March', '(Surrender at) Appomattox', '(Battle of) Antietam/Sharpsburg', 'Lincoln was assassinated.', 'Battle of Fort Sumter', 'Battle of Vicksburg', 'Battle of Gettysburg', 'Surrender at Appomattox'] },
  { id: 94, section: S.hist18, q: 'Abraham Lincoln is famous for many things. Name one.', a: ['Freed the slaves (Emancipation Proclamation)', 'Saved (or preserved) the Union', 'Led the United States during the Civil War', '16th president of the United States', 'Delivered the Gettysburg Address', 'Freed the slaves', 'Saved the Union', 'Preserved the Union'], s: true },
  { id: 95, section: S.hist18, q: 'What did the Emancipation Proclamation do?', a: ['Freed the slaves', 'Freed slaves in the Confederacy', 'Freed slaves in the Confederate states', 'Freed slaves in most Southern states'] },
  { id: 96, section: S.hist18, q: 'What U.S. war ended slavery?', a: ['The Civil War', 'Civil War'] },
  { id: 97, section: S.hist18, q: 'What amendment says all persons born or naturalized in the United States, and subject to the jurisdiction thereof, are U.S. citizens?', a: ['14th Amendment'] },
  { id: 98, section: S.hist18, q: 'When did all men get the right to vote?', a: ['After the Civil War', 'During Reconstruction', '(With the) 15th Amendment', '15th Amendment', '1870'] },
  { id: 99, section: S.hist18, q: 'Name one leader of the women’s rights movement in the 1800s.', a: ['Susan B. Anthony', 'Elizabeth Cady Stanton', 'Sojourner Truth', 'Harriet Tubman', 'Lucretia Mott', 'Lucy Stone'] },
  { id: 100, section: S.histR, q: 'Name one war fought by the United States in the 1900s.', a: ['World War I', 'World War II', 'Korean War', 'Vietnam War', '(Persian) Gulf War', 'Persian Gulf War'] },
  { id: 101, section: S.histR, q: 'Why did the United States enter World War I?', a: ['Because Germany attacked U.S. (civilian) ships', 'To support the Allied Powers (England, France, Italy, and Russia)', 'To oppose the Central Powers (Germany, Austria-Hungary, the Ottoman Empire, and Bulgaria)'] },
  { id: 102, section: S.histR, q: 'When did all women get the right to vote?', a: ['1920', 'After World War I', '(With the) 19th Amendment', '19th Amendment'] },
  { id: 103, section: S.histR, q: 'What was the Great Depression?', a: ['Longest economic recession in modern history'] },
  { id: 104, section: S.histR, q: 'When did the Great Depression start?', a: ['The Great Crash (1929)', 'Stock market crash of 1929'] },
  { id: 105, section: S.histR, q: 'Who was president during the Great Depression and World War II?', a: ['(Franklin) Roosevelt', 'Franklin Roosevelt', 'Roosevelt'] },
  { id: 106, section: S.histR, q: 'Why did the United States enter World War II?', a: ['(Bombing of) Pearl Harbor', 'Japanese attacked Pearl Harbor', 'To support the Allied Powers (England, France, and Russia)', 'To oppose the Axis Powers (Germany, Italy, and Japan)', 'Bombing of Pearl Harbor'] },
  { id: 107, section: S.histR, q: 'Dwight Eisenhower is famous for many things. Name one.', a: ['General during World War II', 'President at the end of (during) the Korean War', '34th president of the United States', 'Signed the Federal-Aid Highway Act of 1956 (Created the Interstate System)'] },
  { id: 108, section: S.histR, q: 'Who was the United States’ main rival during the Cold War?', a: ['Soviet Union', 'USSR', 'Russia'] },
  { id: 109, section: S.histR, q: 'During the Cold War, what was one main concern of the United States?', a: ['Communism', 'Nuclear war'] },
  { id: 110, section: S.histR, q: 'Why did the United States enter the Korean War?', a: ['To stop the spread of communism'] },
  { id: 111, section: S.histR, q: 'Why did the United States enter the Vietnam War?', a: ['To stop the spread of communism'] },
  { id: 112, section: S.histR, q: 'What did the civil rights movement do?', a: ['Fought to end racial discrimination'] },
  { id: 113, section: S.histR, q: 'Martin Luther King, Jr. is famous for many things. Name one.', a: ['Fought for civil rights', 'Worked for equality for all Americans', 'Worked to ensure that people would “not be judged by the color of their skin, but by the content of their character”'], s: true },
  { id: 114, section: S.histR, q: 'Why did the United States enter the Persian Gulf War?', a: ['To force the Iraqi military from Kuwait'] },
  { id: 115, section: S.histR, q: 'What major event happened on September 11, 2001 in the United States?', a: ['Terrorists attacked the United States', 'Terrorists took over two planes and crashed them into the World Trade Center in New York City', 'Terrorists took over a plane and crashed into the Pentagon in Arlington, Virginia', 'Terrorists took over a plane originally aimed at Washington, D.C., and crashed in a field in Pennsylvania'], s: true },
  { id: 116, section: S.histR, q: 'Name one U.S. military conflict after the September 11, 2001 attacks.', a: ['(Global) War on Terror', 'War in Afghanistan', 'War in Iraq', 'Global War on Terror'] },
  { id: 117, section: S.histR, q: 'Name one American Indian tribe in the United States.', a: ['Apache', 'Blackfeet', 'Cayuga', 'Cherokee', 'Cheyenne', 'Chippewa', 'Choctaw', 'Creek', 'Crow', 'Hopi', 'Huron', 'Inupiat', 'Lakota', 'Mohawk', 'Mohegan', 'Navajo', 'Oneida', 'Onondaga', 'Pueblo', 'Seminole', 'Seneca', 'Shawnee', 'Sioux', 'Teton', 'Tuscarora'] },
  { id: 118, section: S.histR, q: 'Name one example of an American innovation.', a: ['Light bulb', 'Automobile (cars, internal combustion engine)', 'Skyscrapers', 'Airplane', 'Assembly line', 'Landing on the moon', 'Integrated circuit (IC)'] },
  { id: 119, section: S.sym, q: 'What is the capital of the United States?', a: ['Washington, D.C.'] },
  { id: 120, section: S.sym, q: 'Where is the Statue of Liberty?', a: ['New York (Harbor)', 'Liberty Island', 'New Jersey, near New York City', 'on the Hudson (River)', 'New York Harbor'] },
  { id: 121, section: S.sym, q: 'Why does the flag have 13 stripes?', a: ['(Because there were) 13 original colonies', '(Because the stripes) represent the original colonies', 'Because there were 13 original colonies', 'Because the stripes represent the original colonies'], s: true },
  { id: 122, section: S.sym, q: 'Why does the flag have 50 stars?', a: ['(Because there is) one star for each state', '(Because) each star represents a state', '(Because there are) 50 states', 'Because there is one star for each state', 'Because each star represents a state', 'Because there are 50 states'] },
  { id: 123, section: S.sym, q: 'What is the name of the national anthem?', a: ['The Star-Spangled Banner', 'The Star Spangled Banner'] },
  { id: 124, section: S.sym, q: 'The Nation’s first motto was “E Pluribus Unum.” What does that mean?', a: ['Out of many, one', 'We all become one'] },
  { id: 125, section: S.hol, q: 'What is Independence Day?', a: ['A holiday to celebrate U.S. independence (from Britain)', 'The country’s birthday', 'A holiday to celebrate U.S. independence from Britain'] },
  { id: 126, section: S.hol, q: 'Name three national U.S. holidays.', a: ['New Year’s Day', 'Martin Luther King, Jr. Day', 'Presidents Day (Washington’s Birthday)', 'Memorial Day', 'Juneteenth', 'Independence Day', 'Labor Day', 'Columbus Day', 'Veterans Day', 'Thanksgiving Day', 'Christmas Day'], s: true },
  { id: 127, section: S.hol, q: 'What is Memorial Day?', a: ['A holiday to honor soldiers who died in military service'] },
  { id: 128, section: S.hol, q: 'What is Veterans Day?', a: ['A holiday to honor people in the (U.S.) military', 'A holiday to honor people who have served (in the U.S. military)', 'A holiday to honor people in the U.S. military', 'A holiday to honor people who have served in the U.S. military'] },
]

if (raw.length !== 128) {
  console.error('Expected 128 questions, got', raw.length)
  process.exit(1)
}

const ids = new Set()
for (const r of raw) {
  if (ids.has(r.id)) {
    console.error('Duplicate id', r.id)
    process.exit(1)
  }
  ids.add(r.id)
}

const out = `/* Auto-generated by scripts/build-civics-data.mjs — USCIS 2025 Civics Test (128 questions) */
import type { CivicsQuestion } from '../types'

export const CIVICS_QUESTIONS: CivicsQuestion[] = ${JSON.stringify(
  raw.map((r) => ({
    id: r.id,
    section: r.section,
    question: r.q,
    acceptableAnswers: r.a,
    is6520: Boolean(r.s),
  })),
  null,
  2,
)}
`

const dest = path.join(__dirname, '..', 'src', 'data', 'civicsQuestions.ts')
fs.mkdirSync(path.dirname(dest), { recursive: true })
fs.writeFileSync(dest, out)
console.log('Wrote', dest)
