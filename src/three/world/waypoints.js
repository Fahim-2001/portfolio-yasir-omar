import portfolioData from '../../data/portfolio';

/*
 * "The Stack": the geometry of the background world and the camera's path through it.
 * Six plates hang on four rails above a drafting floor, one plate per section from
 * About (z-01) to Education (z-06); Contact (z-07) is the floor itself. Scrolling
 * spirals the camera down around the stack, 60° per section.
 *
 * This file has no three.js import so the HUD can read the layer table from the
 * main bundle.
 */

export const PLATE = 10; // plate width and depth
export const PLATE_T = 0.3; // plate thickness
export const GAP = 11; // vertical distance between plates: neighbours stay out of frame
export const TOP = 62; // height of plate z-01
export const CLOUD_Y = 71; // the cloud above the stack
export const plateY = (k) => TOP - (k - 1) * GAP;

// Counts drawn by the dioramas, shared with the HUD so the two always agree.
export const UI_PLATES = 4;
export const BAR_COUNT = 14;
export const PIN_COUNT = 40;
export const ROUTE_COUNT = 28;

/**
 * One camera waypoint per section, in cylindrical coordinates around the stack.
 * theta: degrees around the stack · radius / y: camera position · target: look-at point
 * fov · shift / rise: lens shift on wide frames, as a fraction of the frame (+ moves
 * the subject right / up), aimed at the empty part of each section's layout ·
 * fog: [near, far] · dim: how far the world steps back behind that section's text
 * (readability first: the content always wins). The hero waypoint frames the overview
 * the camera dives from, but the world is not shown there (CameraRig fades it in).
 */
export const WAYPOINTS = [
  { theta: -34, radius: 112, y: 82, target: [0, 39, 0], fov: 36, shift: 0.17, rise: 0, fog: [96, 235], dim: 0 },
  { theta: 26, radius: 22, y: 69.5, target: [0, 63.2, 0], fov: 38, shift: 0.1, rise: 0.2, fog: [20, 46], dim: 0.6 },
  { theta: 86, radius: 22, y: 58.5, target: [0, 52.6, 0], fov: 38, shift: -0.3, rise: -0.18, fog: [20, 46], dim: 0.6 },
  { theta: 146, radius: 23, y: 47.5, target: [0, 42, 0], fov: 38, shift: 0.08, rise: 0.24, fog: [21, 47], dim: 0.62 },
  { theta: 206, radius: 21, y: 35.5, target: [0, 32, 0], fov: 40, shift: 0.31, rise: 0, fog: [19, 45], dim: 0.5 },
  { theta: 266, radius: 22, y: 25, target: [0, 20.2, 0], fov: 38, shift: 0.22, rise: 0.16, fog: [20, 46], dim: 0.58 },
  { theta: 326, radius: 21, y: 14, target: [0, 8, 0], fov: 38, shift: 0.1, rise: 0.2, fog: [19, 45], dim: 0.6 },
  { theta: 404, radius: 48, y: 9, target: [0, 19, 0], fov: 52, shift: 0.26, rise: 0.05, fog: [44, 170], dim: 0.45 },
];

const pad = (n) => String(n).padStart(2, '0');
const { experience, projects, skills } = portfolioData;
const commits = experience.reduce((sum, job) => sum + job.points.length, 0);
const containers = projects.reduce((sum, project) => sum + project.stack.length, 0);
const nodes = skills.reduce((sum, group) => sum + group.items.length, 0);

/** Layer annotations, indexed like SECTION_IDS. Scene metadata, never résumé claims. */
export const LAYERS = [
  { id: 'hero', z: 'z-00', name: 'Cloud', stats: ['full stack', `layers ${pad(WAYPOINTS.length - 1)}`] },
  { id: 'about', z: 'z-01', name: 'Interface', stats: ['exploded view', `plates ${pad(UI_PLATES)}`] },
  {
    id: 'experience',
    z: 'z-02',
    name: 'Version control',
    stats: [`branches ${pad(experience.length)}`, `commits ${pad(commits)}`],
  },
  {
    id: 'projects',
    z: 'z-03',
    name: 'Deploy',
    stats: [`stacks ${pad(projects.length)}`, `containers ${pad(containers)}`],
  },
  { id: 'skills', z: 'z-04', name: 'Dependencies', stats: [`groups ${pad(skills.length)}`, `nodes ${pad(nodes)}`] },
  { id: 'achievements', z: 'z-05', name: 'Algorithms', stats: [`bubble sort n=${BAR_COUNT}`, 'in-order walk'] },
  { id: 'education', z: 'z-06', name: 'Foundations', stats: ['die 01', `pins ${pad(PIN_COUNT)}`] },
  { id: 'contact', z: 'z-07', name: 'Network', stats: [`routes ${pad(ROUTE_COUNT)}`, 'broadcasting'] },
];
