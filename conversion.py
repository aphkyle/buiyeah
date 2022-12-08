with open("src/kTotalStrokes.txt", 'r', encoding='utf-8') as f:
    abc = f.read()

for line in abc.splitlines():
    if line.startswith('U'):
        curindex = -1
        while line[curindex] != '\t':
            curindex += 1
        UXXXX = line[0:curindex][2:]
        abc = abc.replace(line[0:curindex], chr(int(UXXXX, 16)))
        print(chr(int(UXXXX, 16)), ' ', (int(UXXXX, 16)-13312)/192431 * 100, '%', sep='')

with open("src/kTotalStrokes.txt", 'w', encoding='utf-8') as f:
    f.write(abc)
