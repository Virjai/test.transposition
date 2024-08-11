const fs = require('fs');

const minNote = [-3, 10]
const maxNote = [5, 1]


function getSeminotePosition([octave, note]){
    return (octave * 12) + note;
}

function getNoteFromSemitonePosition(semitonePosition){
    const octave = Math.floor( semitonePosition / 12 )
    const note = semitonePosition % 12 ;
    return [ octave, note ];
}


function isWithinRange(note){
    const minPosition = getSeminotePosition( minNote )
    const maxPosition = getSeminotePosition( maxNote )
    const notePosition = getSeminotePosition( note )
    return notePosition >= minPosition && notePosition <=maxPosition
}

function transpose( notes, semitones) {
    const transposedNotes = notes.map( (note) => {
        const notePosition = getSeminotePosition( note )
        const newNotePosition = notePosition + semitones
        const newNote = getNoteFromSemitonePosition(newNotePosition)

        if(!isWithinRange(newNote)){
            throw new Error(`Error: Transposed note ${newNote} is out of keyboard range.`)
        }

        return newNote;
    })
    return transposedNotes
}


// function to read input json file and write the output json file

function main(inputFile, semitones){
    try {
        const input = JSON.parse(fs.readFileSync(inputFile, 'utf8'))
        const notes = input.notes
        const transposedNotes = transpose(notes, semitones)
        const output = { notes: transposedNotes }

        fs.writeFileSync('output.json', JSON.stringify(output, null, 2), 'utf8')
        console.log(`Transposition successful! Output save to output.json`);
        
    } catch (error) {
        console.log(error.message);
        
    }
}


const args = process.argv.slice(2)
if(args.length < 2){
    console.error('Usage: node transpose.js <inputFile> <semitones>')
    process.exit(1)
}

const inputFile = args[0]
const semitones = parseInt(args[1], 10)


main(inputFile, semitones)