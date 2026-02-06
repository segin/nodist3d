from playwright.sync_api import sync_playwright

def run(page):
    page.on("console", lambda msg: print(f"Console: {msg.text}"))
    page.on("pageerror", lambda err: print(f"PageError: {err}"))

    print("Navigating...")
    page.goto("http://localhost:3000")

    print("Waiting...")
    page.wait_for_timeout(5000)

    page.screenshot(path="verification/debug.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            run(page)
        finally:
            browser.close()
