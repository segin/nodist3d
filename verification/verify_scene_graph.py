from playwright.sync_api import Page, expect, sync_playwright

def verify_scene_graph_accessibility(page: Page):
    # Listen to console
    page.on("console", lambda msg: print(f"Console: {msg.text}"))
    page.on("pageerror", lambda err: print(f"Page Error: {err}"))

    # 1. Arrange: Go to the app.
    page.goto("http://localhost:3000")

    # Wait for scene graph
    scene_graph = page.locator("#scene-graph")
    expect(scene_graph).to_be_visible()
    print("Scene graph visible")

    # 2. Act: Add a Box.
    # Check if dat.gui is present
    # It usually has a class 'dg'
    gui = page.locator(".dg.main")
    if gui.count() > 0:
        print("dat.gui found")
    else:
        print("dat.gui NOT found")
        # Snapshot current state
        page.screenshot(path="verification/debug_gui.png")

    # Locate the "Add Box" button in dat.gui.
    # It might be in a closed folder, but code says .open().
    # Try finding "Add Primitives" first
    add_prim = page.get_by_text("Add Primitives")
    if add_prim.count() > 0:
         print("Add Primitives folder found")

    # Try clicking Add Box
    print("Clicking Add Box...")
    page.get_by_text("Add Box").click()
    print("Clicked Add Box")

    # 3. Assert: Check if object appeared in scene graph.
    # Check for the list item (Box_1)
    box_item = scene_graph.get_by_text("Box_1")
    expect(box_item).to_be_visible()

    # Check for the accessibility buttons
    # "Hide object" button (aria-label="Hide Box_1")
    hide_btn = page.locator('button[aria-label="Hide Box_1"]')
    expect(hide_btn).to_be_visible()
    expect(hide_btn).to_have_attribute("title", "Hide object")
    print("Hide button verified")

    # "Delete object" button (aria-label="Delete Box_1")
    delete_btn = page.locator('button[aria-label="Delete Box_1"]')
    expect(delete_btn).to_be_visible()
    expect(delete_btn).to_have_attribute("title", "Delete object")
    print("Delete button verified")

    # 4. Screenshot
    page.screenshot(path="verification/scene_graph_a11y.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_scene_graph_accessibility(page)
            print("Verification successful!")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/failure.png")
            raise e
        finally:
            browser.close()
