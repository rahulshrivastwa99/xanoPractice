import cv2
import threading
import pygame.midi
import time
from cvzone.HandTrackingModule import HandDetector


def list_midi_devices():
    print("Available MIDI output devices:")
    for i in range(pygame.midi.get_count()):
        info = pygame.midi.get_device_info(i)
        interf, name, is_input, is_output, opened = info
        if is_output:
            print(f"Device id {i}: {name.decode()}")


# 🎹 Initialize Pygame MIDI
pygame.midi.init()
list_midi_devices()

# Try to find a valid MIDI output device
midi_device_id = None
for i in range(pygame.midi.get_count()):
    info = pygame.midi.get_device_info(i)
    interf, name, is_input, is_output, opened = info
    if is_output:
        midi_device_id = i
        print(f"Using MIDI output device id {midi_device_id}: {name.decode()}")
        break

if midi_device_id is None:
    print("❌ No MIDI output device found. Exiting.")
    exit(1)

try:
    player = pygame.midi.Output(midi_device_id)
except Exception as e:
    print(f"❌ Failed to open MIDI output device: {e}")
    exit(1)

player.set_instrument(0)  # 0 = Acoustic Grand Piano

# 🎐 Initialize Hand Detector
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("❌ Cannot open webcam. Exiting.")
    exit(1)

detector = HandDetector(detectionCon=0.8)

# 🎺 Chord Mapping for Fingers (D Major Scale)
chords = {
    "left": {
        "thumb": [62, 66, 69],   # D Major (D, F#, A)
        "index": [64, 67, 71],   # E Minor (E, G, B)
        "middle": [66, 69, 73],  # F# Minor (F#, A, C#)
        "ring": [67, 71, 74],    # G Major (G, B, D)
        "pinky": [69, 73, 76]    # A Major (A, C#, E)
    },
    "right": {
        "thumb": [62, 66, 69],   # D Major (D, F#, A)
        "index": [64, 67, 71],   # E Minor (E, G, B)
        "middle": [66, 69, 73],  # F# Minor (F#, A, C#)
        "ring": [67, 71, 74],    # G Major (G, B, D)
        "pinky": [69, 73, 76]    # A Major (A, C#, E)
    }
}

# Sustain Time (in seconds) after the finger is lowered
SUSTAIN_TIME = 2.0

# Track Previous States to Stop Chords
prev_states = {hand: {finger: 0 for finger in chords[hand]} for hand in chords}

# Lock for thread-safe MIDI note off
note_off_lock = threading.Lock()

# 🎵 Function to Play a Chord


def play_chord(chord_notes):
    print(f"Playing chord: {chord_notes}")
    with note_off_lock:
        for note in chord_notes:
            player.note_on(note, 127)  # Start playing

# 🎵 Function to Stop a Chord After a Delay


def stop_chord_after_delay(chord_notes):
    print(f"Stopping chord after delay: {chord_notes}")
    time.sleep(SUSTAIN_TIME)  # Sustain for specified time
    with note_off_lock:
        for note in chord_notes:
            player.note_off(note, 127)  # Stop playing


print("Starting hand tracking and MIDI chord player...")

try:
    while True:
        success, img = cap.read()
        if not success:
            print("❌ Camera not capturing frames")
            continue

        hands, img = detector.findHands(img, draw=True)

        if hands:
            for hand in hands:
                hand_type = "left" if hand["type"] == "Left" else "right"
                fingers = detector.fingersUp(hand)
                finger_names = ["thumb", "index", "middle", "ring", "pinky"]

                for i, finger in enumerate(finger_names):
                    if finger in chords[hand_type]:  # Only check assigned chords
                        if fingers[i] == 1 and prev_states[hand_type][finger] == 0:
                            play_chord(chords[hand_type][finger])  # Play chord
                        elif fingers[i] == 0 and prev_states[hand_type][finger] == 1:
                            threading.Thread(target=stop_chord_after_delay, args=(
                                chords[hand_type][finger],), daemon=True).start()
                        # Update state
                        prev_states[hand_type][finger] = fingers[i]
        else:
            for hand in chords:
                for finger in chords[hand]:
                    threading.Thread(target=stop_chord_after_delay, args=(
                        chords[hand][finger],), daemon=True).start()
            prev_states = {
                hand: {finger: 0 for finger in chords[hand]} for hand in chords}

        cv2.imshow("Hand Tracking MIDI Chords", img)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
except KeyboardInterrupt:
    print("Program Khatam...")
finally:
    cap.release()
    cv2.destroyAllWindows()
    pygame.midi.quit()
    player.close()
