import PianoBlackKey from "@/components/PianoBlackKey";
import PianoWhiteKey from "@/components/PianoWhiteKey";
import { JSX, useCallback, useMemo, useRef, useState } from "react";
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  View
} from "react-native";
import keyboardStyle from "../styles/keybordStyle";

const OCTAVE_WHITE_NOTES = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_KEYS_DATA = [
  { note: "C#", afterIndex: 0 },
  { note: "D#", afterIndex: 1 },
  { note: "F#", afterIndex: 3 },
  { note: "G#", afterIndex: 4 },
  { note: "A#", afterIndex: 5 },
];

// All 12 chromatic notes in order within an octave
const CHROMATIC_NOTES = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

interface KeyboardProps {
  zoom: number;
  currentOctave: number;
  playNote: (note: string, octave: number) => void;
  stopNote: (note: string, octave: number) => void;
}

interface KeyRect {
  noteKey: string; // e.g. "C#4"
  note: string;
  octave: number;
  xStart: number; // left edge in px
  xEnd: number; // right edge in px
  isBlack: boolean;
}

export default function Keyboard({
  zoom,
  currentOctave,
  playNote,
  stopNote,
}: KeyboardProps) {
  const totalWhiteKeysCount = zoom * 7 + 1;
  const whiteKeyWidthPercent = 100 / totalWhiteKeysCount;

  // Track pressed note keys for visual state
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  // Map touch identifier → noteKey currently under that finger
  const activeTouches = useRef<Map<string, string>>(new Map());

  // Keyboard layout dimensions
  const keyboardLayout = useRef<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Build the key hit-test rectangles from layout
  const keyRects = useMemo((): KeyRect[] => {
    // We compute fractional positions (0-1) since we don't know width yet.
    // Actual pixel positions are resolved at touch time.
    const rects: KeyRect[] = [];
    const whiteKeyFraction = 1 / totalWhiteKeysCount;
    const blackKeyWidthFraction = whiteKeyFraction * 0.7;

    // White keys
    let whiteIdx = 0;
    for (let o = 0; o < zoom; o++) {
      const octave = currentOctave + o;
      for (const note of OCTAVE_WHITE_NOTES) {
        rects.push({
          noteKey: `${note}${octave}`,
          note,
          octave,
          xStart: whiteIdx * whiteKeyFraction,
          xEnd: (whiteIdx + 1) * whiteKeyFraction,
          isBlack: false,
        });
        whiteIdx++;
      }
    }
    // Final trailing C
    const finalOctave = currentOctave + zoom;
    rects.push({
      noteKey: `C${finalOctave}`,
      note: "C",
      octave: finalOctave,
      xStart: whiteIdx * whiteKeyFraction,
      xEnd: (whiteIdx + 1) * whiteKeyFraction,
      isBlack: false,
    });

    // Black keys (overlaid on top)
    for (let o = 0; o < zoom; o++) {
      const octave = currentOctave + o;
      const octaveStartIdx = o * 7;
      for (const data of BLACK_KEYS_DATA) {
        const globalIdx = octaveStartIdx + data.afterIndex;
        const center = (globalIdx + 1) * whiteKeyFraction;
        const halfWidth = blackKeyWidthFraction / 2;
        rects.push({
          noteKey: `${data.note}${octave}`,
          note: data.note,
          octave,
          xStart: center - halfWidth,
          xEnd: center + halfWidth,
          isBlack: true,
        });
      }
    }

    return rects;
  }, [zoom, currentOctave, totalWhiteKeysCount]);

  // Determine which key a touch point falls on
  const hitTest = useCallback(
    (pageX: number, pageY: number): KeyRect | null => {
      const layout = keyboardLayout.current;
      if (!layout) return null;

      const relX = pageX - layout.x;
      const relY = pageY - layout.y;

      // Out of bounds
      if (relX < 0 || relX > layout.width || relY < 0 || relY > layout.height)
        return null;

      const fraction = relX / layout.width;

      // Black keys only occupy the top ~62% of the keyboard
      const isInBlackKeyZone = relY / layout.height < 0.62;

      // Check black keys first (they are on top)
      if (isInBlackKeyZone) {
        for (const rect of keyRects) {
          if (
            rect.isBlack &&
            fraction >= rect.xStart &&
            fraction < rect.xEnd
          ) {
            return rect;
          }
        }
      }

      // Then white keys
      for (const rect of keyRects) {
        if (
          !rect.isBlack &&
          fraction >= rect.xStart &&
          fraction < rect.xEnd
        ) {
          return rect;
        }
      }

      return null;
    },
    [keyRects],
  );

  // Process all changed touches and update state
  const processTouches = useCallback(
    (event: GestureResponderEvent) => {
      const changedTouches = event.nativeEvent.changedTouches ?? [
        event.nativeEvent,
      ];
      let changed = false;

      for (const touch of changedTouches) {
        const id = touch.identifier;
        const hitKey = hitTest(touch.pageX, touch.pageY);
        const prevNoteKey = activeTouches.current.get(id) ?? null;
        const newNoteKey = hitKey?.noteKey ?? null;

        if (prevNoteKey === newNoteKey) continue;

        // Finger left a key
        if (prevNoteKey) {
          const prevRect = keyRects.find((r) => r.noteKey === prevNoteKey);
          if (prevRect) {
            // Only stop if no other finger is on the same key
            let otherFingerOnKey = false;
            for (const [otherId, otherKey] of activeTouches.current) {
              if (otherId !== id && otherKey === prevNoteKey) {
                otherFingerOnKey = true;
                break;
              }
            }
            if (!otherFingerOnKey) {
              stopNote(prevRect.note, prevRect.octave);
            }
          }
          activeTouches.current.delete(id);
          changed = true;
        }

        // Finger entered a key
        if (newNoteKey && hitKey) {
          // Only play if no other finger is already on this key
          let alreadyPlaying = false;
          for (const [, otherKey] of activeTouches.current) {
            if (otherKey === newNoteKey) {
              alreadyPlaying = true;
              break;
            }
          }
          if (!alreadyPlaying) {
            playNote(hitKey.note, hitKey.octave);
          }
          activeTouches.current.set(id, newNoteKey);
          changed = true;
        }
      }

      if (changed) {
        // Rebuild pressed keys set from active touches
        setPressedKeys(new Set(activeTouches.current.values()));
      }
    },
    [hitTest, keyRects, playNote, stopNote],
  );

  // Release all touches for given identifiers
  const releaseTouches = useCallback(
    (event: GestureResponderEvent) => {
      const changedTouches = event.nativeEvent.changedTouches ?? [
        event.nativeEvent,
      ];
      let changed = false;

      for (const touch of changedTouches) {
        const id = touch.identifier;
        const prevNoteKey = activeTouches.current.get(id);
        if (prevNoteKey) {
          const rect = keyRects.find((r) => r.noteKey === prevNoteKey);
          if (rect) {
            // Only stop if no other finger is on the same key
            let otherFingerOnKey = false;
            for (const [otherId, otherKey] of activeTouches.current) {
              if (otherId !== id && otherKey === prevNoteKey) {
                otherFingerOnKey = true;
                break;
              }
            }
            if (!otherFingerOnKey) {
              stopNote(rect.note, rect.octave);
            }
          }
          activeTouches.current.delete(id);
          changed = true;
        }
      }

      if (changed) {
        setPressedKeys(new Set(activeTouches.current.values()));
      }
    },
    [keyRects, stopNote],
  );

  const onKeyboardLayout = useCallback((event: LayoutChangeEvent) => {
    const target = event.target;
    if (target && typeof (target as any).measureInWindow === "function") {
      (target as any).measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          keyboardLayout.current = { x, y, width, height };
        },
      );
    }
  }, []);

  // Build key elements
  const whiteKeys: JSX.Element[] = [];
  const blackKeys: JSX.Element[] = [];

  for (let o = 0; o < zoom; o++) {
    const octave = currentOctave + o;
    const octaveStartIdx = o * 7;

    OCTAVE_WHITE_NOTES.forEach((note) => {
      const noteKey = `${note}${octave}`;
      whiteKeys.push(
        <PianoWhiteKey
          key={`white-${octave}-${note}`}
          note={note}
          label={note === "C" ? `${note}${octave}` : undefined}
          isPressed={pressedKeys.has(noteKey)}
        />,
      );
    });

    BLACK_KEYS_DATA.forEach((data) => {
      const globalIdx = octaveStartIdx + data.afterIndex;
      const offset = `${(globalIdx + 1) * whiteKeyWidthPercent}%`;
      const noteKey = `${data.note}${octave}`;
      blackKeys.push(
        <PianoBlackKey
          key={`black-${octave}-${data.note}`}
          note={data.note}
          offset={offset}
          width={`${whiteKeyWidthPercent * 0.7}%`}
          isPressed={pressedKeys.has(noteKey)}
        />,
      );
    });
  }

  // Final trailing C
  const finalOctave = currentOctave + zoom;
  whiteKeys.push(
    <PianoWhiteKey
      key={`white-${finalOctave}-C`}
      note="C"
      label={`C${finalOctave}`}
      isPressed={pressedKeys.has(`C${finalOctave}`)}
    />,
  );

  return (
    <View style={keyboardStyle.container}>
      <View style={keyboardStyle.topBar}>
        <View style={keyboardStyle.topBarHighlight} />
      </View>
      <View
        style={keyboardStyle.keyboard}
        onLayout={onKeyboardLayout}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderStart={processTouches}
        onResponderMove={processTouches}
        onResponderRelease={releaseTouches}
        onResponderTerminate={releaseTouches}
      >
        <View style={keyboardStyle.feltStrip} pointerEvents="none" />
        {whiteKeys}
        {blackKeys}
        <View style={keyboardStyle.lidShadow} pointerEvents="none" />
      </View>
    </View>
  );
}


