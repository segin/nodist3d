# nodist3d

*A lightweight, web-based 3D modeling application, optimized for mobile devices.*

The name "nodist3d" is a combination of:
*   **No**de.js: The backend runtime environment.
*   **-ist**: A suffix denoting a person who uses or is an expert in something.
*   **3D**: For three-dimensional modeling.

---

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/segin/nodist3d)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![GitHub issues](https://img.shields.io/github/issues/segin/nodist3d)](https://github.com/segin/nodist3d/issues)
[![GitHub stars](https://img.shields.io/github/stars/segin/nodist3d)](https://github.com/segin/nodist3d/stargazers)

**[Live Demo](https://segin.github.io/nodist3d/)** (coming soon)

## Screenshots

*(Coming soon)*

## Core Features

-   **Comprehensive Set of 3D Primitives:**
    -   [x] Box (Cube)
    -   [x] Sphere
    -   [x] Cylinder
    -   [x] Cone
    -   [x] Torus
    -   [x] Torus Knot
    -   [x] Tetrahedron (Triangle)
    -   [x] Icosahedron
    -   [x] Dodecahedron
    -   [x] Octahedron
    -   [x] Plane
    -   [x] Tube
    -   [x] Teapot
-   **Mobile-First Design:** The user interface is fully responsive and optimized for touch-based interactions on mobile devices.
-   **Fullscreen Mode:** A dedicated button allows you to easily enter and exit fullscreen mode for an immersive modeling experience.
-   **File-based Storage:** Your 3D scenes are saved in a custom `.nodist3d` zip file, which contains the scene data in a `scene.json` file.
-   **Intuitive User Interface:** A clean and user-friendly interface makes it easy to add, manipulate, and combine 3D objects.

## Tech Stack

-   **Backend:** Node.js, Express.js
-   **Frontend:** HTML5, CSS3, JavaScript, three.js
-   **Testing:** Jest, Supertest

## Getting Started

### Prerequisites

-   Node.js (v14 or later)
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/segin/nodist3d.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd nodist3d
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

1.  Start the server:
    ```bash
    npm start
    ```
2.  Open your web browser and navigate to `http://localhost:3000`.

## Usage Guide

*(Coming soon)*

## Testing

To run the test suite, use the following command:

```bash
npm test
```

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Author

*   **Kirn Gill II** - *Initial work* - [segin](https://github.com/segin)

## Project Checklist

This checklist meticulously tracks all requirements and tasks derived from the initial `PROMPT.md`.

### Project Setup & Management

-   [x] Create a web-based 3D modeling program.
-   [x] Use Node.js to host the backend.
-   [x] Use WebGL to render everything in the browser.
-   [x] Create a Git repository in this directory if one does not exist (checked using `find` command).
-   [x] Meticulously add each item to a central `README.md` document.
-   [x] First create a blank `README.md`.
-   [x] Commit the blank `README.md`.
-   [x] Commit `README.md` after adding all checkboxes.
-   [x] Each primitive object shall be a new checkbox in the list.
-   [x] Create a `CONTEXT.md` file for working context, ideas, and progress.
-   [ ] Treat `CONTEXT.md` as a cache; clear it out once done with something.
-   [x] Commit changes to `CONTEXT.md` to the Git repository.
-   [x] Check for the existence of `gh` using Termux `pkg` commands.
-   [x] Take note of all installed `pkg` and `npm` packages before getting started.
-   [x] Create a GitHub repository `nodist3d`.
-   [x] Push each commit to GitHub as it happens.
-   [x] Explain that the name is Node.js + -ist + 3D.
-   [x] Save this original prompt as `PROMPT.md`.
-   [x] Commit `PROMPT.md`.
-   [x] Never change `PROMPT.md`.

### Core Functionality

-   [x] Include support for all basic 3D primitives.
-   [x] Come up with a list of 3D primitives to include in the default set (and ensure the list is not too short).
    -   [x] Box (Cube)
    -   [x] Sphere
    -   [x] Cylinder
    -   [x] Cone
    -   [x] Torus
    -   [x] Torus Knot
    -   [x] Tetrahedron (Triangle)
    -   [x] Icosahedron
    -   [x] Dodecahedron
    -   [x] Octahedron
    -   [x] Plane
    -   [x] Tube
    -   [x] Teapot
-   [x] Optimize the application interface for mobile.
-   [x] Node.js webserver listens on localhost for a browser to connect to.
-   [ ] Optimize the code.
-   [x] Use a custom zip file format with JSON data inside for persistent local storage.
-   [x] Make sure there is an interface button on the user controls of the web frontend to easily enter and leave full screen mode.

### Testing

-   [x] Create a suite of unit tests.
-   [x] Create a full test harness.
-   [x] Test the full codebase.

## Roadmap

This section outlines potential future enhancements and features for nodist3d.

### User Interface & Experience

-   [x] Implement interactive controls for object manipulation (translate, rotate, scale).
-   [x] Add a property panel to adjust primitive parameters (e.g., cube dimensions, sphere radius).
-   [x] Implement a scene graph/outliner to manage multiple objects.
-   [x] Implement undo functionality.
-   [x] Implement redo functionality.
-   [x] Implement camera controls:
    -   [x] Implement orbit camera control.
    -   [x] Implement pan camera control.
    -   [x] Implement zoom camera control.
-   [x] Add a grid helper for better scene orientation.
-   [x] Add an axis helper for better scene orientation.
-   [x] Implement material editing:
    -   [x] Change object color.
    -   [x] Adjust material roughness.
    -   [x] Adjust material metallicness.
    -   [x] Add texture mapping:
        -   [x] Implement basic texture loading and application.
        -   [x] Add UI controls for texture selection.
        -   [x] Support different texture types (e.g., diffuse, normal, roughness).
-   [x] Add light source manipulation:
    -   [x] Change light type (e.g., PointLight, DirectionalLight, AmbientLight).
    -   [x] Adjust light intensity.
    -   [x] Adjust light position.
-   [x] Implement a "snap to grid" feature.
-   [x] Add a selection mechanism for objects.
-   [x] Implement object grouping/ungrouping.
-   [x] Add a "duplicate object" feature.
-   [x] Implement a "delete object" feature.
-   [x] Add a "reset view" button.
-   [x] Implement a "save as image" feature for rendering the scene.

### Core Functionality & Primitives

-   [x] Add more complex primitives (e.g., LatheGeometry, ExtrudeGeometry, TextGeometry).
-   [x] Implement boolean operations (CSG - Constructive Solid Geometry) for combining/subtracting objects.
-   [x] Add support for importing/exporting common 3D formats (e.g., OBJ, GLTF).
-   [x] Implement a custom shader editor for advanced material customization.
-   [x] Add support for textures.
-   [ ] Implement a physics engine for basic simulations.

### Backend & Storage

-   [x] Implement the custom zip file format for local storage.
-   [ ] Add cloud storage integration (e.g., Google Drive, Dropbox) for scene persistence.
-   [ ] Implement real-time collaboration features (multi-user editing).

### Performance & Optimization

-   [ ] Implement level of detail (LOD) for complex scenes.
-   [ ] Optimize rendering performance for mobile devices.
-   [ ] Implement Web Workers for offloading heavy computations.

### Testing & CI/CD

-   [ ] Expand unit test coverage for all new features.
-   [ ] Implement end-to-end (E2E) tests for UI interactions.
-   [ ] Set up a Continuous Integration/Continuous Deployment (CI/CD) pipeline for automated testing and deployment.
