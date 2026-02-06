<<<<<<< HEAD
from playwright.sync_api import sync_playwright

def verify(page):
    print("Navigating...")
    page.goto("http://localhost:3000")

    print("Waiting for load...")
    page.wait_for_load_state("networkidle")

    # Move Scene Graph panel to avoid overlap
    print("Moving Scene Graph panel...")
    page.evaluate("document.getElementById('scene-graph-panel').style.right = '300px'")

    print("Adding box...")
    page.get_by_text("Add Box").click()

    print("Waiting for Box_1...")
    page.wait_for_selector("#scene-graph-panel li:has-text('Box_1')")

    li = page.locator("#scene-graph-panel li:has-text('Box_1')").first

    role = li.get_attribute('role')
    tabindex = li.get_attribute('tabindex')
    aria_label = li.get_attribute('aria-label')

    print(f"LI Role: {role}")
    print(f"LI Tabindex: {tabindex}")
    print(f"LI Aria-Label: {aria_label}")

    btns = li.locator("button")

    vis_btn = btns.nth(0)
    del_btn = btns.nth(1)

    vis_aria = vis_btn.get_attribute('aria-label')
    vis_title = vis_btn.get_attribute('title')

    del_aria = del_btn.get_attribute('aria-label')
    del_title = del_btn.get_attribute('title')

    print(f"Vis Button Aria-Label: {vis_aria}")
    print(f"Vis Button Title: {vis_title}")

    print(f"Del Button Aria-Label: {del_aria}")
    print(f"Del Button Title: {del_title}")

    page.screenshot(path="verification/verification.png")
=======
from playwright.sync_api import sync_playwright, expect

def test_scene_graph_accessibility(page):
    page.on("console", lambda msg: print(f"Console: {msg.text}"))
    page.on("pageerror", lambda err: print(f"Page Error: {err}"))

    print("Navigating to app...")
    page.goto("http://localhost:3000")

    try:
        page.locator("#c").wait_for(timeout=30000)
        print("Canvas loaded.")
    except:
        print("Canvas not found within timeout.")
        page.screenshot(path="/home/jules/verification/verification_error.png")
        return

    # Check for Scene Graph container
    try:
        scene_graph = page.locator("#scene-graph-panel")
        scene_graph.wait_for(timeout=30000)
        expect(scene_graph).to_be_visible()
        print("Scene graph panel found.")
    except Exception as e:
        print(f"Scene graph panel not found: {e}")
        page.screenshot(path="/home/jules/verification/verification_error.png")
        return

    objects_list = page.locator("ul[role='listbox']")
    try:
        expect(objects_list).to_be_visible(timeout=30000)
        print("Found accessible objects list.")
    except Exception as e:
         print(f"Objects list not found: {e}")

    # Click 'Add Box' in dat.gui
    print("Attempting to add a box...")
    try:
        add_box_btn = page.get_by_text("Add Box")
        if add_box_btn.is_visible():
            # Force click because scene graph might overlap
            add_box_btn.click(force=True)
            print("Clicked Add Box")
        else:
            print("Add Box button not visible")
    except Exception as e:
        print(f"Failed to click Add Box: {e}")

    # Verify the new list item
    try:
        option = page.locator("li[role='option']")
        option.wait_for(timeout=30000)
        print("Found option item.")

        tabindex = option.get_attribute("tabindex")
        aria_selected = option.get_attribute("aria-selected")
        print(f"Tabindex: {tabindex}, Aria-selected: {aria_selected}")

        if tabindex != "0":
            print("FAILURE: Tabindex is not 0")
        if aria_selected != "true":
            print("FAILURE: Aria-selected is not true")

        vis_btn = option.locator("button").filter(has_text="👁")
        if vis_btn.count() == 0:
             vis_btn = option.locator("button").filter(has_text="🚫")

        if vis_btn.count() > 0:
            label = vis_btn.first.get_attribute("aria-label")
            print(f"Visibility Button Label: {label}")
            if not label or "Toggle visibility" not in label:
                print("FAILURE: Visibility label incorrect")
        else:
            print("FAILURE: Visibility button not found")

        del_btn = option.locator("button").filter(has_text="🗑")
        if del_btn.count() > 0:
            label = del_btn.first.get_attribute("aria-label")
            print(f"Delete Button Label: {label}")
            if not label or "Delete" not in label:
                print("FAILURE: Delete label incorrect")
        else:
            print("FAILURE: Delete button not found")

    except Exception as e:
        print(f"Verification failed: {e}")

    page.screenshot(path="/home/jules/verification/verification.png")
>>>>>>> master
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
<<<<<<< HEAD
            verify(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
=======
            test_scene_graph_accessibility(page)
        except Exception as e:
            print(f"Error: {e}")
>>>>>>> master
        finally:
            browser.close()
