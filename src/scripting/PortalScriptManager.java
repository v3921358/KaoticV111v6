/*
 This file is part of the OdinMS Maple Story Server
 Copyright (C) 2008 ~ 2010 Patrick Huy <patrick.huy@frz.cc> 
 Matthias Butz <matze@odinms.de>
 Jan Christian Meyer <vimes@odinms.de>

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License version 3
 as published by the Free Software Foundation. You may not use, modify
 or distribute this program under any other version of the
 GNU Affero General Public License.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package scripting;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.script.Compilable;
import javax.script.CompiledScript;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineFactory;
import javax.script.ScriptEngineManager;

import client.MapleClient;
import java.lang.reflect.UndeclaredThrowableException;
import javax.script.ScriptException;
import server.MaplePortal;
import tools.FilePrinter;
import tools.FileoutputUtil;

public class PortalScriptManager {

    private static final PortalScriptManager instance = new PortalScriptManager();
    private Map<String, PortalScript> scripts = new HashMap<String, PortalScript>();
    private ScriptEngineFactory sef;

    public final static PortalScriptManager getInstance() {
        return new PortalScriptManager();
    }

    private PortalScriptManager() {
        ScriptEngineManager sem = new ScriptEngineManager();
        sef = sem.getEngineByName("javascript").getFactory();
    }

    private PortalScript getPortalScript(final String scriptName) {
        File scriptFile = new File("scripts/portal/" + scriptName + ".js");
        if (!scriptFile.exists()) {
            scripts.put(scriptName, null);
            return null;
        }
        FileReader fr = null;
        ScriptEngine portal = sef.getScriptEngine();
        try {
            fr = new FileReader(scriptFile);

            // java 8 support here thanks to Arufonsu
            //if (ServerConstants.JAVA_8){
            //        portal.eval("load('nashorn:mozilla_compat.js');" + System.lineSeparator());
            //}
            ((Compilable) portal).compile(fr).eval();
        } catch (ScriptException | IOException | UndeclaredThrowableException e) {
            System.out.println("Error in Portal Script " + scriptName);
            FilePrinter.printError(FilePrinter.PORTAL + scriptName + ".txt", e);
        } finally {
            if (fr != null) {
                try {
                    fr.close();
                } catch (IOException e) {
                    System.out.println("Error in Portal Script " + scriptName);
                    e.printStackTrace();
                }
            }
        }
        PortalScript script = ((Invocable) portal).getInterface(PortalScript.class);
        scripts.put(scriptName, script);
        return script;
    }

    public final boolean executePortalScript(final MaplePortal portal, final MapleClient c) {
        try {
            PortalScript script = getPortalScript(portal.getScriptName());
            if (script != null) {
                script.enter(new PortalPlayerInteraction(c, portal));
                dispose(portal.getScriptName());
                return true;
            }
        } catch (UndeclaredThrowableException ute) {
            FilePrinter.printError(FilePrinter.PORTAL + portal.getScriptName() + ".txt", ute);
        } catch (final Exception e) {
            FilePrinter.printError(FilePrinter.PORTAL + portal.getScriptName() + ".txt", e);
        }
        return false;
    }

    public void dispose(String scriptName) {
        if (scripts.containsKey(scriptName)) {
            scripts.remove(scriptName);
        }
    }
}
