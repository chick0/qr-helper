function typeUpdated() {
    let select = document.querySelector("select#type")
    Object.values(document.querySelector("select#type").options).map((x) => document.getElementById(x.value).classList.add("hide"))
    document.getElementById(select.value).classList.remove("hide")
    reset()
    qrcodeUpdate()
}

function getType() {
    return Number(document.querySelector("select").options[document.querySelector("select").selectedIndex].value)
}

function getBox() {
    return document.getElementById(document.querySelector("select").options[document.querySelector("select").selectedIndex].value)
}

function qrcodeUpdate() {
    if (getType() == 1) {
        let value = getBox().querySelector("input").value.trim()
        let help = getBox().querySelector("p")

        if (!value.startsWith("http://") && !value.startsWith("https://")) {
            help.classList.remove("hide")
            reset()
        } else {
            help.classList.add("hide")
            makeCode(value)
        }
    } else if (getType() == 2) {
        let ssid = document.getElementById("ssid").value
        let proto = document.getElementById("proto").value
        let password = document.getElementById("password").value
        let hidden = document.getElementById("hidden").checked

        if (proto.length == 0) {
            document.getElementById("password").readOnly = true
            password = ""
        } else {
            document.getElementById("password").readOnly = false
        }

        makeCode(`WIFI:S:${ssid};T:${proto};P:${password};H:${hidden};;`)
    }
}

function makeCode(value) {
    requestAnimationFrame(() => {
        QR.clear()
        QR.makeCode(value)
        hideOrShowButton(false)
    })
}

function reset() {
    document.querySelector("img").src = ""
    hideOrShowButton(true)
}

function hideOrShowButton(hideIt) {
    if (hideIt === true) {
        document.getElementById("buttons").classList.add("hide")
    } else {
        document.getElementById("buttons").classList.remove("hide")
    }
}

function getMaxSize() {
    let size = document.querySelector(".two-box > div:nth-child(2)").offsetWidth - 100

    if (size < 256) {
        return 256
    }

    return size
}

function qrResize() {
    document.getElementById("qrcode").innerHTML = "";
    QR = new QRCode("qrcode", {
        width: getMaxSize(),
        height: getMaxSize()
    })

    qrcodeUpdate()
}

let QR = new QRCode("qrcode", {
    width: getMaxSize(),
    height: getMaxSize()
})

window.oninput = qrcodeUpdate
window.onresize = qrResize
document.querySelector("select").addEventListener("change", typeUpdated)
document.addEventListener("DOMContentLoaded", () => {
    typeUpdated()
})

document.getElementById("download").addEventListener("click", () => {
    let link = document.createElement("a")
    link.href = document.querySelector("img").src
    link.download = "qrcode.png"
    link.click()
})
