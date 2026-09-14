#!/usr/bin/env python3
"""
Generate audio files for flower parts game using Edge TTS (free, local).
Uses en-US-AnaNeural voice - child-friendly "Cute" voice with "Cartoon, Conversation" style.
"""

import asyncio
import edge_tts
from pathlib import Path
import subprocess

OUTPUT_DIR = Path("audio")
OUTPUT_DIR.mkdir(exist_ok=True)

# Flower parts to generate - (filename, word, pronunciation guide for reference)
WORDS = [
    ("anther", "anther", "AN-thur"),
    ("filament", "filament", "FIL-uh-ment"),
    ("stigma", "stigma", "STIG-muh"),
    ("style", "style", "style"),
    ("ovary", "ovary", "OH-vuh-ree"),
    ("ovule", "ovule", "OV-yool"),
    ("sepal", "sepal", "SEE-puhl"),
    ("petal", "petal", "PET-uhl"),
]

VOICE = "en-US-AnaNeural"  # Child-friendly "Cute" voice, Cartoon/Conversation style
RATE = "-15%"  # Slightly slower for children
PITCH = "+5Hz"  # Slightly higher pitch for friendlier tone


async def generate_audio(text: str, output_file: Path):
    """Generate audio using edge-tts with child-friendly settings."""
    communicate = edge_tts.Communicate(
        text=text,
        voice=VOICE,
        rate=RATE,
        pitch=PITCH,
    )
    await communicate.save(str(output_file))


def add_silence(input_file: Path, output_file: Path, silence_duration: float = 0.5):
    """Append silence to audio file using ffmpeg."""
    cmd = [
        "ffmpeg", "-y",
        "-i", str(input_file),
        "-f", "lavfi", "-i", f"anullsrc=r=24000:cl=stereo:d={silence_duration}",
        "-filter_complex", "[0:a][1:a]concat=n=2:v=0:a=1[out]",
        "-map", "[out]", "-b:a", "128k", str(output_file)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.returncode == 0


async def main():
    print(f"Generating audio files using {VOICE} (rate={RATE}, pitch={PITCH})")
    print(f"Output directory: {OUTPUT_DIR}\n")

    # Generate all audio files
    for filename, word, pronunciation in WORDS:
        output_file = OUTPUT_DIR / f"{filename}.mp3"
        print(f"Generating: {filename}.mp3 ({word} = {pronunciation})")
        await generate_audio(word, output_file)

    print("\nAdding 0.5s silence to each file...")
    # Add 0.5s silence to each file
    for filename, word, pronunciation in WORDS:
        input_file = OUTPUT_DIR / f"{filename}.mp3"
        temp_file = OUTPUT_DIR / f"{filename}_temp.mp3"

        if add_silence(input_file, temp_file, 0.5):
            temp_file.replace(input_file)
            print(f"  Added silence to {filename}.mp3")
        else:
            print(f"  Warning: Failed to add silence to {filename}.mp3")

    print(f"\nDone! All 8 files created in {OUTPUT_DIR}/")
    for filename, _, _ in WORDS:
        print(f"  - {filename}.mp3")


if __name__ == "__main__":
    asyncio.run(main())