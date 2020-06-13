import UIfx from 'uifx';
import bgmusic from '../src/sounds/Broke_For_Free_-_10_-_Covered_In_Oil.mp3';
import collectSound from '../src/sounds/135936__bradwesson__collectcoin__CC.mp3'
import hit01Sound from '../src/sounds/hit_01_made_from_Impact_gravier_by_Julien_Nicolas_.mp3'
import hit02Sound from '../src/sounds/hit_02_made_from_Impact_gravier_by_Julien_Nicolas_.mp3'
import hit03Sound from '../src/sounds/hit_03_made_from_Impact_gravier_by_Julien_Nicolas_.mp3'
import healSound from '../src/sounds/Andy_Rhode_342750__rhodesmas__coins-purchase-4_attribution.mp3'

const sounds = {
    bgmusic: new UIfx(bgmusic, {volume: 0.05}),
    collectSound: new UIfx(collectSound, {volume: 0.5}),
    healSound: new UIfx(healSound, {volume: 0.75}),
    hit01Sound: new UIfx(hit01Sound, {volume: 0.75}),
    hit02Sound: new UIfx(hit02Sound, {volume: 0.75}),
    hit03Sound: new UIfx(hit03Sound, {volume: 0.75}),
}

export { sounds };