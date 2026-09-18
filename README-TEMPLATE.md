# Reusable Educational Game Template

This project is a reusable educational game template containing three learning stages:

1. Explorer Mode
2. Challenge Mode
3. Exam Mode

The template separates game content, audio, highlights, and stage logic so that a new educational game can be created without rewriting the game engine.

---

## 1. Project Structure

```text
project-root/
│
├── index.html
├── style.css
├── app.js
├── game-config.js
├── README-TEMPLATE.md
│
├── js/
│   ├── audio.js
│   ├── explorer.js
│   ├── challenge.js
│   └── exam.js
│
└── assets/
    ├── digestive-system/
    │   ├── 0_whole.svg
    │   ├── explorer-highlights/
    │   └── challenge-highlights/
    │
    └── audio/
        └── digestive-system/
            ├── explorer/
            ├── challenge/
            └── exam/
```

---

## 2. Files You May Modify

When creating a new educational game, most changes should be made in:

```text
game-config.js
```

You may also replace files inside:

```text
assets/
```

The main files that may be customized are:

- `game-config.js`
- The whole diagram image
- Explorer Highlight images
- Challenge Highlight images
- Explorer pronunciation audio
- Challenge pronunciation audio
- Challenge completion sound
- Exam success and wrong sounds

The main educational content should be controlled from `game-config.js`, including:

- Game title
- Subtitle
- Part names
- Part IDs
- Hints
- Descriptions
- Asset paths
- Connector coordinates
- Challenge slot sides
- Exam questions
- Exam answers
- Feedback text
- Certificate text

---

## 3. Files You Should Not Modify

Do not normally modify the following engine files:

```text
app.js
js/audio.js
js/explorer.js
js/challenge.js
js/exam.js
```

These files contain the reusable game engine.

Do not modify them when only changing:

- The game topic
- Part names
- Images
- Audio
- Hints
- Questions
- Answers
- Certificate text
- Connector coordinates

Modify the engine files only when adding a new feature that should be available in every game created from the template.

Do not rename HTML IDs or CSS classes unless the corresponding JavaScript and CSS are also updated.

Do not modify generated SVG or MP3 files unless a replacement asset is required.

---

## 4. Creating a New Game

Never edit the original template directly.

Create a copy first.

Example using PowerShell:

```powershell
Copy-Item `
  "D:\Templates\educational-game-template" `
  "D:\Games\new-educational-game" `
  -Recurse
```

Or use a one-line command:

```powershell
Copy-Item "D:\Templates\educational-game-template" "D:\Games\new-educational-game" -Recurse
```

Open the new project:

```powershell
code "D:\Games\new-educational-game"
```

Change the new game's title, content, assets, and questions only inside the copied project.

---

## 5. Editing General Game Information

Open:

```text
game-config.js
```

Edit the general game section:

```javascript
game: {
  id: "digestive-system",
  title: "Digestive System Explorer",
  subtitle: "Hover over a part name to highlight it.",
  grade: 4,
  language: "en-US"
}
```

Example for a respiratory-system game:

```javascript
game: {
  id: "respiratory-system",
  title: "Respiratory System Explorer",
  subtitle: "Explore the main parts of the respiratory system.",
  grade: 4,
  language: "en-US"
}
```

Use a short ID containing lowercase letters and hyphens only.

---

## 6. Editing the Parts

Each part must have a unique ID.

Example:

```javascript
{
  id: "mouth",
  name: "Mouth",
  hint: "Food enters the digestive system here.",
  description: "Chewing breaks food into smaller pieces."
}
```

Keep IDs consistent in:

- Part configuration
- Highlight paths
- Audio paths
- Connector targets
- Challenge slots
- Exam questions

Recommended ID format:

```text
mouth
esophagus
small-intestine
large-intestine
```

Do not use spaces in IDs.

Use display names for learner-facing text:

```text
Food pipe (Esophagus)
Small Intestine
Large Intestine
```

---

## 7. Replacing the Main Image

The main complete diagram is normally stored as:

```text
assets/digestive-system/0_whole.svg
```

For a new game, replace the file or change its path in `game-config.js`.

Recommended requirements:

- SVG format
- Transparent or white background
- Portrait or landscape dimensions appropriate for the game
- All parts visible
- No unnecessary text inside the image
- Consistent image dimensions across Highlight files

Do not change the image dimensions after connector coordinates have been finalized.

---

## 8. Replacing Explorer Highlight Images

Explorer Highlight files are stored in:

```text
assets/digestive-system/explorer-highlights/
```

Example:

```text
1_mouth_Highlight.svg
2_esophagus_Highlight.svg
3_stomach_Highlight.svg
4_small_intestine_Highlight.svg
5_large_intestine_Highlight.svg
6_anus_Highlight.svg
```

Explorer Mode must use only Explorer Highlight files.

Every Highlight file should:

- Have the same page dimensions as the whole image
- Have a transparent background
- Keep the highlighted part in its exact original position
- Contain only the highlighted part
- Use a clearly visible color
- Avoid moving or resizing the highlighted part

Update the Explorer Highlight paths in `game-config.js`.

Example:

```javascript
explorer: {
  highlight:
    "assets/digestive-system/explorer-highlights/1_mouth_Highlight.svg"
}
```

---

## 9. Replacing Challenge Highlight Images

Challenge Highlight files are stored in:

```text
assets/digestive-system/challenge-highlights/
```

Challenge Mode must use only Challenge Highlight files.

The Challenge files may use a different color or Glow style from Explorer.

Example:

```javascript
challenge: {
  highlight:
    "assets/digestive-system/challenge-highlights/1_mouth_Highlight.svg"
}
```

Do not make Challenge functions use Explorer Highlight paths.

Do not make Explorer functions use Challenge Highlight paths.

---

## 10. Replacing Explorer Audio

Explorer pronunciation files are stored in:

```text
assets/audio/digestive-system/explorer/
```

Example:

```text
mouth.mp3
esophagus.mp3
stomach.mp3
small-intestine.mp3
large-intestine.mp3
anus.mp3
```

Update the Explorer audio path for each part:

```javascript
explorer: {
  audio:
    "assets/audio/digestive-system/explorer/mouth.mp3"
}
```

Explorer Mode must not use Challenge or Exam audio.

Recommended audio requirements:

- MP3 format
- Clear pronunciation
- Low background noise
- Short duration
- Consistent volume
- Simple lowercase filenames
- No spaces in filenames

---

## 11. Replacing Challenge Audio

Challenge audio files are stored in:

```text
assets/audio/digestive-system/challenge/
```

This directory contains:

- Part pronunciation files
- Challenge completion sound

Example:

```text
mouth.mp3
esophagus.mp3
stomach.mp3
small-intestine.mp3
large-intestine.mp3
anus.mp3
completion-sound.mp3
```

Part audio example:

```javascript
challenge: {
  audio:
    "assets/audio/digestive-system/challenge/mouth.mp3"
}
```

Completion audio example:

```javascript
challenge: {
  completionAudio:
    "assets/audio/digestive-system/challenge/completion-sound.mp3"
}
```

The completion sound must play only when all Challenge answers are correct.

---

## 12. Replacing Exam Sounds

Exam sounds are stored in:

```text
assets/audio/digestive-system/exam/
```

Required files:

```text
success.mp3
wrong.mp3
```

Configuration example:

```javascript
exam: {
  successAudio:
    "assets/audio/digestive-system/exam/success.mp3",

  wrongAudio:
    "assets/audio/digestive-system/exam/wrong.mp3"
}
```

The correct-answer sound and wrong-answer sound must not overlap.

---

## 13. Adjusting Explorer Connector Coordinates

Explorer connector target coordinates are stored in `game-config.js`.

Example:

```javascript
explorer: {
  connectorTarget: {
    x: 57,
    y: 6
  }
}
```

The coordinates are percentages relative to the main image:

```text
x = horizontal position
y = vertical position
```

Coordinate directions:

```text
Increase x = move right
Decrease x = move left
Increase y = move down
Decrease y = move up
```

Adjust one part at a time.

Recommended adjustment size:

```text
1 or 2 units per test
```

After each change:

1. Save `game-config.js`.
2. Refresh the browser using `Ctrl + F5`.
3. Test the related part.
4. Repeat until the connector reaches the correct target.

Do not change connector calculations in `js/explorer.js` when only adjusting positions.

---

## 14. Adjusting Challenge Connector Coordinates

Challenge connector coordinates are separate from Explorer coordinates.

Example:

```javascript
challenge: {
  connectorTarget: {
    x: 55,
    y: 12
  }
}
```

Changing Challenge coordinates must not change Explorer coordinates.

The Challenge connector has two ends:

- The slot-side point
- The anatomical target point

The configured target controls the point inside the image.

Coordinate directions:

```text
Increase x = move the image endpoint right
Decrease x = move the image endpoint left
Increase y = move the image endpoint down
Decrease y = move the image endpoint up
```

Do not modify Explorer connector coordinates while adjusting Challenge.

---

## 15. Choosing the Challenge Slot Side

Each part can be assigned to the left or right Challenge panel.

Example:

```javascript
challenge: {
  side: "left"
}
```

Valid values:

```text
left
right
```

For a six-part activity, the recommended distribution is:

```text
3 parts on the left
3 parts on the right
```

The configuration validator should report an error if the expected distribution is invalid.

---

## 16. Adding Exam Questions

Exam questions are stored in:

```text
game-config.js
```

Example:

```javascript
{
  id: "question-1",
  type: "function",

  question:
    "Where does food enter the digestive system?",

  options: [
    "Mouth",
    "Stomach",
    "Anus",
    "Large Intestine"
  ],

  answer: "Mouth",

  explanation:
    "Food enters through the mouth, where chewing begins."
}
```

Every question must contain:

- A unique ID
- A type
- Question text
- An options array
- A correct answer
- An explanation when available

The correct answer must exactly match one item in `options`.

Recommended question types:

```text
name
function
sequence
image
application
```

Use direct and age-appropriate language.

Do not place HTML inside question text unless the Exam module explicitly supports it.

---

## 17. Configuring the Number of Exam Questions

Set the number of questions used in each attempt:

```javascript
exam: {
  questionsPerAttempt: 6
}
```

The question bank may contain more questions than the number shown in one attempt.

Example:

```text
Question bank: 18 questions
Questions per attempt: 6
```

This allows different questions to appear in repeated attempts.

---

## 18. Editing Certificate Information

Certificate configuration is stored in `game-config.js`.

Example:

```javascript
certificate: {
  title: "Certificate of Excellence",
  courseTitle: "Digestive System Explorer",

  description:
    "This certificate is proudly awarded for successfully completing the Level 3 Exam.",

  studentName: "Student Name",
  showDate: true,
  minimumScore: 4
}
```

You may modify:

- Certificate title
- Course title
- Description
- Student-name setting
- Minimum score
- Date visibility

Do not modify certificate rendering code in `js/exam.js` when only changing certificate text.

---

## 19. Running the Game Locally

Open PowerShell inside the project folder.

Run:

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

If port `8080` is already in use, use another port:

```powershell
python -m http.server 8081 --bind 127.0.0.1
```

Open the game:

```text
http://127.0.0.1:8080/
```

or:

```text
http://127.0.0.1:8081/
```

Do not open the game using a `file:///` address.

Keep the PowerShell window open while testing.

To stop the server, press `Ctrl + C` physically on the keyboard.

---

## 20. Checking JavaScript Syntax

Run all syntax checks before browser testing:

```powershell
node --check game-config.js
node --check js/audio.js
node --check js/explorer.js
node --check js/challenge.js
node --check js/exam.js
node --check app.js
```

No output means the syntax check passed.

---

## 21. Testing the Template

### Explorer Mode Test

Confirm:

- Six part buttons appear
- Left and right distribution is correct
- Tooltips display correctly
- Highlights display correctly
- Connector lines reach the correct targets
- Pronunciation audio works
- Start Challenge works

### Challenge Mode Test

Confirm:

- Six draggable words appear
- Six answer slots appear
- Drag and drop works
- Word hints work
- Slot hover works
- Challenge Highlights work
- Challenge connectors work
- Slot audio buttons work
- Check Answers works
- RESET INCORRECT works
- Reset All works
- Completion modal appears at the full score
- Completion sound works
- Play Again works
- Start Exam works

### Exam Mode Test

Confirm:

- Questions load
- Four options appear
- Progress text and bar work
- Correct answers become green
- Incorrect answers become red
- Success sound works
- Wrong sound works
- Next Question works
- Back works
- Final score is correct
- Certificate appears
- Print Certificate works

---

## 22. Browser Developer Tools Test

Open developer tools using:

```text
F12
```

### Console

Confirm that this message appears:

```text
GAME_CONFIG validation passed.
```

Confirm that no game-related JavaScript errors appear.

Errors caused by browser extensions are not necessarily game errors.

### Network

Enable:

```text
Disable cache
```

Refresh using:

```text
Ctrl + F5
```

Confirm:

- SVG requests return HTTP `200`
- MP3 requests return HTTP `200` or `206`
- No required file returns `404`
- Explorer uses Explorer asset directories
- Challenge uses Challenge asset directories
- Exam uses Exam asset directories

---

## 23. Testing Responsive Design

Test at desktop width and mobile width.

Desktop should show:

```text
3 left parts | main diagram | 3 right parts
```

On mobile:

- Text remains readable
- Buttons remain at least 44px high
- The diagram fits the screen
- Challenge slots stack correctly
- Exam options use one column
- Modal dialogs fit inside the viewport

---

## 24. Configuration Validation

The game validates `GAME_CONFIG` during startup.

A successful configuration should display:

```text
GAME_CONFIG validation passed.
```

The validator checks:

- GAME_CONFIG exists
- Parts are present
- IDs are unique
- Names and hints exist
- Asset paths exist in the configuration
- Connector coordinates are numeric
- Challenge sides are valid
- Exam questions are valid
- Correct answers exist in the options
- Certificate information exists

If validation fails, correct `game-config.js` before editing the engine.

---

## 25. Git Workflow for a New Game

Check the repository status:

```powershell
git status
```

Create a new repository or connect the project to one.

Example:

```powershell
git init
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
```

Add only the required files:

```powershell
git add index.html
git add style.css
git add app.js
git add game-config.js
git add js
git add assets
git add README-TEMPLATE.md
```

Review:

```powershell
git status
```

Create the first commit:

```powershell
git commit -m "Create educational game"
```

Push:

```powershell
git push -u origin main
```

Do not use `git add .` until all temporary and backup files have been removed or ignored.

---

## 26. Publishing with GitHub Pages

After pushing the project:

1. Open the repository on GitHub.
2. Open `Settings`.
3. Open `Pages`.
4. Under source, choose:
   - Deploy from a branch
5. Select:
   - Branch: `main`
   - Folder: `/root`
6. Save.
7. Wait for deployment.
8. Open the generated GitHub Pages address.
9. Refresh with `Ctrl + F5`.

Confirm all SVG and MP3 files are present in the repository before testing the published game.

---

## 27. Files to Exclude

Do not publish temporary files such as:

```text
*.backup
*.tmp
New Text Document.txt
test_highlights.html
test_svgs.html
```

Add local-only items to `.gitignore`:

```gitignore
*.backup
*.tmp
.vscode/
New Text Document.txt
```

Do not ignore required SVG, MP3, JavaScript, CSS, HTML, or configuration files.

---

## 28. Final Pre-Publish Checklist

Before publishing a new game, confirm:

- [ ] The title is correct
- [ ] The subtitle is correct
- [ ] All part IDs are unique
- [ ] All part names are correct
- [ ] All hints are correct
- [ ] The whole image loads
- [ ] Explorer Highlights load
- [ ] Challenge Highlights load
- [ ] Explorer audio works
- [ ] Challenge audio works
- [ ] Completion sound works
- [ ] Exam success sound works
- [ ] Exam wrong sound works
- [ ] Explorer connector positions are correct
- [ ] Challenge connector positions are correct
- [ ] Challenge slot sides are correct
- [ ] Drag and drop works
- [ ] RESET INCORRECT works
- [ ] Reset All works
- [ ] Exam questions are accurate
- [ ] Correct answers belong to the options
- [ ] Certificate content is correct
- [ ] Printing works
- [ ] Mobile layout works
- [ ] `GAME_CONFIG validation passed.` appears
- [ ] JavaScript syntax checks pass
- [ ] No required asset returns `404`
- [ ] Git status contains no unwanted files

---

## 29. Recommended Development Rule

When changing only game content, modify:

```text
game-config.js
assets/
```

When fixing a reusable engine feature, modify the relevant module:

```text
js/audio.js
js/explorer.js
js/challenge.js
js/exam.js
```

Use `app.js` only for:

- Configuration validation
- Global UI binding
- Module initialization
- General startup coordination

Do not place stage-specific logic back into `app.js`.

---

## 30. Safe Release Process

Use this sequence:

```text
1. Edit configuration
2. Replace assets
3. Run syntax checks
4. Test Explorer
5. Test Challenge
6. Test Exam
7. Test certificate
8. Check Console and Network
9. Review Git status
10. Commit
11. Push
12. Test GitHub Pages
```
---

## 31. Explorer Guided Tour

Explorer Mode includes an optional Guided Tour controlled from
`game-config.js`.

Example configuration:

```javascript
explorer: {
  guidedTour: {
    enabled: true,
    durationPerPart: 3500,
    playAudio: true
  }
}
```

### Guided Tour settings

- `enabled`: Shows or hides the Guided Tour button.
- `durationPerPart`: Sets the display time for each part in milliseconds.
- `playAudio`: Enables or disables pronunciation audio during the tour.

### Guided Tour behavior

The Guided Tour:

1. Follows the configured parts in their existing order.
2. Activates the corresponding Explorer button.
3. Shows the related Explorer Highlight.
4. Activates the related connector line.
5. Displays the configured hint.
6. Plays pronunciation audio when `playAudio` is enabled.
7. Changes the button text to `■ Stop Tour` while running.
8. Stops immediately when the Stop Tour button is selected.
9. Stops when the learner manually interacts with a part.
10. Stops before entering Challenge Mode.
11. Restarts from the first configured part after completion.

### Guided Tour validation

Confirm:

- [ ] The tour begins with the first configured part.
- [ ] All configured parts appear in order.
- [ ] Each Highlight matches the selected part.
- [ ] Each connector matches the selected part.
- [ ] Each hint is displayed correctly.
- [ ] Audio plays only when enabled.
- [ ] Stop Tour stops the sequence immediately.
- [ ] Manual interaction stops the tour.
- [ ] Start Challenge stops the tour.
- [ ] Returning to Explorer allows the tour to restart.

---

## 32. Challenge Single-Label Slot Behavior

Every Challenge answer slot accepts exactly one label.

When a new label is placed in an occupied slot:

1. The previous label returns to the Word Bank.
2. The previous audio control is removed.
3. The new label replaces the previous label.
4. The slot keeps its visible number.
5. The slot contains no more than one audio button.
6. Previous evaluation classes are cleared.

A configured part must never exist:

- In two answer slots at the same time.
- In an answer slot and the Word Bank at the same time.
- More than once inside the Word Bank.

### Challenge replacement tests

Confirm:

- [ ] A label can be placed in an empty slot.
- [ ] A new label replaces the existing slot label.
- [ ] The replaced label returns to the Word Bank exactly once.
- [ ] Placing all labels sequentially in one slot leaves only the last label.
- [ ] Moving a label between slots empties the previous slot.
- [ ] Dropping the same label into the same slot does not duplicate it.
- [ ] Each filled slot contains no more than one audio button.
- [ ] Check Answers evaluates the current label only.
- [ ] RESET INCORRECT returns incorrect labels exactly once.
- [ ] Reset All restores all configured labels exactly once.

---

---

## 33. Challenge Tap-to-Place Support

Challenge Mode supports an alternative placement method for phones,
tablets, touchscreens, mouse users, and keyboard users.

The existing desktop drag-and-drop behavior remains available.

### Configuration

The instruction text is configured in `game-config.js`:

```javascript
ui: {
  challenge: {
    tapToPlaceInstruction:
      "Now choose an answer slot."
  }
}
```

### Tap-to-Place behavior

1. Select a label in the Word Bank.
2. The selected label receives a visible selected state.
3. The instruction asks the learner to choose an answer slot.
4. Select an answer slot.
5. The selected label moves into the slot.
6. The selected state is cleared after placement.

### Replacing an occupied slot

If the learner places a new label in an occupied slot:

1. The old label returns to the Word Bank.
2. The old audio button is removed.
3. The new label replaces the old label.
4. The slot keeps its visible number.
5. The slot contains exactly one label.
6. The slot contains no more than one audio button.

### Cancelling selection

The current selection can be cancelled by:

- Selecting the same Word Bank label again.
- Pressing the Escape key.
- Using Reset All.
- Using RESET INCORRECT.
- Leaving Challenge Mode.
- Starting Exam Mode.

### Keyboard support

1. Use `Tab` to focus a Word Bank label.
2. Press `Enter` or `Space` to select it.
3. Use `Tab` to focus an answer slot.
4. Press `Enter` or `Space` to place the selected label.
5. Press `Escape` to cancel the current selection.

### Mobile testing

Recommended test viewport:

```text
Width: 390 px
Height: 844 px
```

Confirm:

- [ ] A Word Bank label can be selected by tapping.
- [ ] The selected label has a visible selected state.
- [ ] The placement instruction appears.
- [ ] Tapping an empty slot places the selected label.
- [ ] Tapping an occupied slot replaces its current label.
- [ ] The replaced label returns to the Word Bank exactly once.
- [ ] No slot contains more than one label.
- [ ] No slot contains more than one audio button.
- [ ] Selecting the same label again cancels selection.
- [ ] Selecting another label transfers selection.
- [ ] Escape cancels selection.
- [ ] Enter and Space work.
- [ ] Reset All clears selection.
- [ ] RESET INCORRECT clears selection.
- [ ] Vertical scrolling remains available.
- [ ] Desktop drag-and-drop continues to work.
- [ ] No duplicate labels appear.

---
---

## 34. Explorer Progress Tracking

Explorer Mode can track which configured parts the learner has explored.

The progress indicator displays the number of explored parts, for example:

```text
Explored: 3 of 6 parts
```

When all configured parts have been explored, it displays:

```text
Explored: 6 of 6 parts · All parts explored!
```

### Configuration

Configure progress tracking inside the existing Explorer configuration in
`game-config.js`:

```javascript
progressTracking: {
  enabled: true,
  label: "Explored",
  completedMessage: "All parts explored!",
  persist: false
}
```

### Configuration properties

- `enabled`: Shows or hides the Explorer progress indicator.
- `label`: Controls the text displayed before the progress count.
- `completedMessage`: Appears when all configured parts are explored.
- `persist`: Controls whether progress is stored between page reloads.

For the current template version, `persist` defaults to `false`.

### Progress behavior

A configured part becomes explored when the learner:

1. Clicks or activates the part button.
2. Uses `Enter` or `Space` on the part button.
3. Reaches the part during Guided Tour.

Hovering over a part does not permanently mark the part as explored.

Each configured part is counted only once.

Progress remains available when moving to Challenge Mode and returning to
Explorer Mode during the same page session.

### Progress validation

Confirm:

- [ ] Initial progress displays `Explored: 0 of 6 parts`.
- [ ] Hover does not increase the progress count.
- [ ] Clicking a part increases the count by one.
- [ ] Clicking the same part again does not increase the count.
- [ ] Every explored part displays a visible check mark.
- [ ] Guided Tour marks each visited part as explored.
- [ ] Completing Guided Tour reaches the configured total.
- [ ] The completion message appears with the numeric count.
- [ ] Progress remains after visiting Challenge and returning to Explorer.
- [ ] Disabling progress tracking hides the progress indicator.
- [ ] Explorer audio, Highlights, connectors, and Guided Tour still work.
- [ ] The progress indicator remains readable on mobile screens.

---

---

## 35. Unlimited Challenge Visual Hint

Challenge Mode includes an unlimited visual Hint system.

The learner may use the Show Hint button at any time during Challenge
Mode without a usage limit.

### Configuration

Configure the Hint behavior inside the existing Challenge configuration
in `game-config.js`:

```javascript
hints: {
  enabled: true,
  duration: 2500,
  playAudio: true,
  buttonText: "Show Hint",
  selectFirstMessage: "Select a label first."
}
```

### Configuration properties

- `enabled`: Shows or hides the Show Hint button.
- `duration`: Controls how long the temporary visual Hint remains visible.
- `playAudio`: Enables or disables pronunciation audio during the Hint.
- `buttonText`: Controls the visible button label.
- `selectFirstMessage`: Appears when Show Hint is pressed without selecting a label.

### Hover and Show Hint behavior

Hovering over a Word Bank label:

1. Displays the configured text Hint only.
2. Does not activate the Highlight.
3. Does not activate the connector.
4. Does not play pronunciation audio.
5. Does not place the selected label.

Selecting a label and pressing Show Hint:

1. Displays the configured text Hint.
2. Shows the correct Challenge Highlight.
3. Activates the correct connector.
4. Plays pronunciation audio when enabled.
5. Clears the temporary visual Hint after the configured duration.
6. Keeps the selected label available for Tap-to-Place.

### Unlimited behavior

- The Show Hint button remains available throughout Challenge Mode.
- No remaining-Hint counter is displayed.
- The button does not become disabled after repeated use.
- The same selected label may request the Hint repeatedly.
- Selecting another label changes the visual Hint target.

### Show Hint button interaction

The Show Hint button uses a subtle interaction effect:

- A light-blue Glow appears during pointer hover.
- The button increases in size only slightly.
- The button does not move vertically.
- Pressing the button produces a small scale reduction.
- Reduced-motion preferences disable transform-based movement.

### Cleanup behavior

The active visual Hint is cleared when:

- The selected label changes.
- Drag-and-drop begins.
- Reset All is selected.
- RESET INCORRECT is selected.
- Challenge Mode is left.
- Exam Mode begins.
- The completion modal opens.
- Play Again is selected.

### Validation checklist

Confirm:

- [ ] Show Hint appears without a remaining-Hint counter.
- [ ] Pressing Show Hint without selecting a label displays `Select a label first.`
- [ ] Hovering over a label displays text only.
- [ ] Hovering does not display a Highlight or activate a connector.
- [ ] Selecting a label and pressing Show Hint displays the correct Highlight.
- [ ] The correct connector becomes active.
- [ ] The configured text Hint appears.
- [ ] Pronunciation audio works when enabled.
- [ ] The temporary visual Hint clears after the configured duration.
- [ ] The selected label remains selected after the Hint clears.
- [ ] Show Hint remains available after repeated use.
- [ ] Tap-to-Place remains operational.
- [ ] Desktop drag-and-drop remains operational.
- [ ] Each answer slot accepts exactly one label.
- [ ] Reset All clears the active visual Hint.
- [ ] RESET INCORRECT clears the active visual Hint.
- [ ] Explorer Guided Tour and progress remain unchanged.
- [ ] Exam Mode and the certificate remain unchanged.
- [ ] The button Glow works without vertical movement.
- [ ] No game-related Console errors appear.

---

Always keep a stable tagged release before major engine changes.